"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore/lite"
import { deleteObject, ref, uploadBytes } from "firebase/storage"
import TrackPlayer from "@/components/track-player"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import { storage } from "@/lib/firebase-admin-client"
import {
  formatTrackDate,
  MAX_TRACK_SIZE,
  PROFILES_COLLECTION,
  toTrack,
  TRACKS_COLLECTION,
  type Profile,
  type Track,
} from "@/lib/tracks"

function ProfileForm({ uid, profile, onSaved }: { uid: string; profile: Profile | null; onSaved: (profile: Profile) => void }) {
  const [artistName, setArtistName] = useState(profile?.artistName ?? "")
  const [socials, setSocials] = useState(profile?.socials ?? "")
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextProfile = { artistName: artistName.trim(), socials: socials.trim() }

    try {
      setError("")
      await setDoc(doc(db, PROFILES_COLLECTION, uid), nextProfile)
      onSaved(nextProfile)
    } catch {
      setError("L'enregistrement a échoué.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="artistName">Nom d'artiste</Label>
        <Input
          id="artistName"
          required
          maxLength={80}
          value={artistName}
          onChange={(event) => setArtistName(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="socials">Réseaux</Label>
        <Input
          id="socials"
          required
          maxLength={300}
          placeholder="Instagram, SoundCloud…"
          value={socials}
          onChange={(event) => setSocials(event.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Enregistrer mon profil
      </Button>
    </form>
  )
}

function UploadForm({ uid, profile, onUploaded }: { uid: string; profile: Profile; onUploaded: () => Promise<void> }) {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      setError("Choisis un fichier audio.")
      return
    }

    if (file.size >= MAX_TRACK_SIZE) {
      setError("Le fichier doit faire moins de 50 Mo.")
      return
    }

    const form = event.currentTarget
    const audioPath = `landing-tracks/${uid}/${crypto.randomUUID()}`
    setError("")
    setIsUploading(true)

    try {
      await uploadBytes(ref(storage, audioPath), file, { contentType: file.type })
      await setDoc(doc(collection(db, TRACKS_COLLECTION)), {
        uid,
        title: title.trim(),
        ...profile,
        audioPath,
        createdAt: serverTimestamp(),
      })
      form.reset()
      setTitle("")
      setFile(null)
      await onUploaded()
    } catch {
      await deleteObject(ref(storage, audioPath)).catch(() => {})
      setError("L'envoi a échoué.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trackTitle">Titre du son</Label>
        <Input
          id="trackTitle"
          required
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trackFile">Fichier audio (50 Mo max)</Label>
        <Input
          id="trackFile"
          type="file"
          accept="audio/*"
          required
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? "Envoi en cours…" : "Envoyer mon son"}
      </Button>
    </form>
  )
}

export default function AccountTracks({ uid }: { uid: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadTracks = useCallback(async () => {
    const snapshot = await getDocs(query(collection(db, TRACKS_COLLECTION), where("uid", "==", uid)))
    setTracks(snapshot.docs.map(toTrack).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")))
  }, [uid])

  useEffect(() => {
    Promise.all([getDoc(doc(db, PROFILES_COLLECTION, uid)), loadTracks()])
      .then(([snapshot]) => setProfile(snapshot.exists() ? (snapshot.data() as Profile) : null))
      .catch(() => setError("Impossible de charger ton espace."))
      .finally(() => setIsLoading(false))
  }, [loadTracks, uid])

  const handleDelete = async (track: Track) => {
    if (!window.confirm(`Supprimer « ${track.title} » ?`)) return

    try {
      await deleteDoc(doc(db, TRACKS_COLLECTION, track.id))
      await deleteObject(ref(storage, track.audioPath)).catch(() => {})
      await loadTracks()
    } catch {
      setError("La suppression a échoué.")
    }
  }

  if (isLoading) return null

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {!profile || isEditing ? (
        <ProfileForm
          uid={uid}
          profile={profile}
          onSaved={(nextProfile) => {
            setProfile(nextProfile)
            setIsEditing(false)
          }}
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{profile.artistName}</p>
              <p className="text-white/60 text-sm break-words">{profile.socials}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
          </div>
          <UploadForm uid={uid} profile={profile} onUploaded={loadTracks} />
        </>
      )}

      {tracks.length > 0 && (
        <ul className="space-y-3">
          {tracks.map((track) => (
            <li key={track.id} className="rounded-2xl border border-white/10 p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-white/50 text-xs">{formatTrackDate(track.createdAt)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(track)}>
                  Supprimer
                </Button>
              </div>
              <TrackPlayer audioPath={track.audioPath} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
