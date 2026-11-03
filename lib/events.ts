import { Timestamp, collection, getDocs, orderBy, query, where } from "firebase/firestore/lite"
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore/lite"
import { db } from "@/lib/firebase"

export const EVENTS_COLLECTION = "landingEvents"

export interface UpcomingEvent {
  id: string
  title: string
  description: string
  startsAt: string
  image: string
  imagePath: string
  location: string | null
  signupUrl: string | null
  price: number | null
  memberDiscountPercent: number | null
  published: boolean
}

export function toUpcomingEvent(snapshot: QueryDocumentSnapshot<DocumentData>): UpcomingEvent {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    title: data.title,
    description: data.description,
    startsAt: data.startsAt.toDate().toISOString(),
    image: data.image,
    imagePath: data.imagePath,
    location: data.location ?? null,
    signupUrl: data.signupUrl ?? null,
    price: data.price ?? null,
    memberDiscountPercent: data.memberDiscountPercent ?? null,
    published: data.published,
  }
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, EVENTS_COLLECTION),
        where("published", "==", true),
        where("startsAt", ">=", Timestamp.now()),
        orderBy("startsAt"),
      ),
    )
    return snapshot.docs.map(toUpcomingEvent)
  } catch (error) {
    // Sans événements, la page reste affichée : seul le carousel disparaît.
    console.error("Impossible de charger les événements", error)
    return []
  }
}

export function formatEventDate(startsAt: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(startsAt))
}

// Morceaux de date du badge des cartes : « Ven. », « 6 », « nov. », « 20:00 ».
export function getEventDateParts(startsAt: string) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).formatToParts(new Date(startsAt))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ""

  return {
    weekday: part("weekday"),
    day: part("day"),
    month: part("month"),
    time: `${part("hour")}:${part("minute")}`,
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price)
}

export function getMemberPrice(price: number, discountPercent: number) {
  return Math.round(price * (100 - discountPercent)) / 100
}
