import type { QueryDocumentSnapshot } from "firebase/firestore/lite"

export const PROFILES_COLLECTION = "landingProfiles"
export const TRACKS_COLLECTION = "landingTracks"
export const MAX_TRACK_SIZE = 50 * 1024 * 1024

export type Profile = {
  artistName: string
  socials: string
}

export type Track = Profile & {
  id: string
  uid: string
  title: string
  audioPath: string
  createdAt: string | null
}

export function toTrack(snapshot: QueryDocumentSnapshot): Track {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    uid: data.uid,
    title: data.title,
    artistName: data.artistName,
    socials: data.socials,
    audioPath: data.audioPath,
    createdAt: data.createdAt?.toDate().toISOString() ?? null,
  }
}

export function formatTrackDate(createdAt: string | null) {
  if (!createdAt) return ""

  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(
    new Date(createdAt),
  )
}
