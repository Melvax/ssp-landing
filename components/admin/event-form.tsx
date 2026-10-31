"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Timestamp, collection, doc, setDoc } from "firebase/firestore/lite"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EVENTS_COLLECTION, formatPrice, getMemberPrice, type UpcomingEvent } from "@/lib/events"
import { db } from "@/lib/firebase"
import { storage } from "@/lib/firebase-admin-client"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

interface EventFormProps {
  event: UpcomingEvent | null
  onCancel: () => void
  onSaved: () => Promise<void>
}

// Le champ datetime-local attend l'heure locale, sans fuseau.
function toDateTimeInput(startsAt: string) {
  const date = new Date(startsAt)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function EventForm({ event, onCancel, onSaved }: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? "")
  const [description, setDescription] = useState(event?.description ?? "")
  const [startsAt, setStartsAt] = useState(event ? toDateTimeInput(event.startsAt) : "")
  const [signupUrl, setSignupUrl] = useState(event?.signupUrl ?? "")
  const [price, setPrice] = useState(event?.price?.toString() ?? "")
  const [discount, setDiscount] = useState(event?.memberDiscountPercent?.toString() ?? "")
  const [published, setPublished] = useState(event?.published ?? false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(event?.image ?? "")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!imageFile) return

    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [imageFile])

  const priceValue = price === "" ? null : Number(price)
  const discountValue = priceValue && discount !== "" ? Number(discount) : null

  const handleImageChange = (file: File | undefined) => {
    setError("")
    if (!file) return

    if (!IMAGE_TYPES.includes(file.type)) {
      setError("L'image doit être au format JPEG, PNG ou WebP.")
    } else if (file.size >= MAX_IMAGE_SIZE) {
      setError("L'image doit faire moins de 5 Mo.")
    } else {
      setImageFile(file)
    }
  }

  const handleSubmit = async (submitEvent: FormEvent) => {
    submitEvent.preventDefault()
    setError("")

    if (!imageFile && !event) {
      setError("Ajoute une image.")
      return
    }

    setIsSaving(true)
    let uploadedPath: string | null = null

    try {
      let image = event?.image ?? ""
      let imagePath = event?.imagePath ?? ""

      if (imageFile) {
        const extension = imageFile.type.split("/")[1]
        const imageRef = ref(storage, `landing-events/${crypto.randomUUID()}.${extension}`)
        await uploadBytes(imageRef, imageFile, { contentType: imageFile.type })
        uploadedPath = imageRef.fullPath
        image = await getDownloadURL(imageRef)
        imagePath = imageRef.fullPath
      }

      const eventRef = event ? doc(db, EVENTS_COLLECTION, event.id) : doc(collection(db, EVENTS_COLLECTION))

      await setDoc(eventRef, {
        title: title.trim(),
        description: description.trim(),
        startsAt: Timestamp.fromDate(new Date(startsAt)),
        image,
        imagePath,
        signupUrl: signupUrl.trim() || null,
        price: priceValue,
        memberDiscountPercent: discountValue,
        published,
      })

      if (imageFile && event) {
        await deleteObject(ref(storage, event.imagePath)).catch(() => {})
      }

      await onSaved()
    } catch {
      if (uploadedPath) await deleteObject(ref(storage, uploadedPath)).catch(() => {})
      setError("L'enregistrement a échoué. Vérifie les champs et réessaie.")
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="text-3xl font-light tracking-tight instrument">
        {event ? "Modifier l'événement" : "Nouvel événement"}
      </h1>

      <div className="space-y-2">
        <Label htmlFor="image">Image (JPEG, PNG ou WebP, moins de 5 Mo)</Label>
        {imagePreview && <img src={imagePreview} alt="" className="w-full max-w-md h-48 rounded-lg object-cover" />}
        <Input
          id="image"
          type="file"
          accept={IMAGE_TYPES.join(",")}
          onChange={(changeEvent) => handleImageChange(changeEvent.target.files?.[0])}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          required
          maxLength={120}
          value={title}
          onChange={(changeEvent) => setTitle(changeEvent.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          maxLength={5000}
          rows={6}
          value={description}
          onChange={(changeEvent) => setDescription(changeEvent.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startsAt">Date et heure</Label>
        <Input
          id="startsAt"
          type="datetime-local"
          required
          value={startsAt}
          onChange={(changeEvent) => setStartsAt(changeEvent.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signupUrl">Lien d'inscription</Label>
        <Input
          id="signupUrl"
          type="url"
          pattern="https?://.+"
          placeholder="https://"
          value={signupUrl}
          onChange={(changeEvent) => setSignupUrl(changeEvent.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix en euros (vide : non affiché, 0 : gratuit)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(changeEvent) => setPrice(changeEvent.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Réduction membres en %</Label>
          <Input
            id="discount"
            type="number"
            min="1"
            max="100"
            step="1"
            disabled={!priceValue}
            value={discount}
            onChange={(changeEvent) => setDiscount(changeEvent.target.value)}
          />
        </div>
      </div>

      {priceValue !== null && priceValue > 0 && discountValue !== null && (
        <p className="text-white/60 text-sm">
          Prix membres : {formatPrice(getMemberPrice(priceValue, discountValue))}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(checked === true)}
        />
        <Label htmlFor="published">Publier sur le site</Label>
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button type="button" variant="ghost" disabled={isSaving} onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
