"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore/lite"
import TrackPlayer from "@/components/track-player"
import { db } from "@/lib/firebase"
import { formatTrackDate, toTrack, TRACKS_COLLECTION, type Track } from "@/lib/tracks"

export default function TracksDashboard() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getDocs(query(collection(db, TRACKS_COLLECTION), orderBy("createdAt", "desc"), limit(50)))
      .then((snapshot) => setTracks(snapshot.docs.map(toTrack)))
      .catch(() => setError("Impossible de charger les sons."))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="mb-12">
      <h1 className="text-3xl font-light tracking-tight instrument mb-6">Derniers sons</h1>

      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
      {!isLoading && !error && tracks.length === 0 && <p className="text-white/60 text-sm">Aucun son pour l'instant.</p>}

      <ul className="space-y-3">
        {tracks.map((track) => (
          <li key={track.id} className="rounded-2xl border border-white/10 p-4 space-y-2">
            <p className="font-medium truncate">{track.title}</p>
            <p className="text-white/70 text-sm truncate">{track.artistName}</p>
            <p className="text-white/50 text-xs break-words">{track.socials}</p>
            <p className="text-white/50 text-xs">{formatTrackDate(track.createdAt)}</p>
            <TrackPlayer audioPath={track.audioPath} />
          </li>
        ))}
      </ul>
    </section>
  )
}
