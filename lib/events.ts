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
