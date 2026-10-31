"use client"

import { useCallback, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore/lite"
import { deleteObject, ref } from "firebase/storage"
import EventForm from "@/components/admin/event-form"
import EventPrice from "@/components/event-price"
import { Button } from "@/components/ui/button"
import { EVENTS_COLLECTION, formatEventDate, toUpcomingEvent, type UpcomingEvent } from "@/lib/events"
import { db } from "@/lib/firebase"
import { storage } from "@/lib/firebase-admin-client"

function getStatus(event: UpcomingEvent) {
  if (!event.published) return "Brouillon"
  return new Date(event.startsAt) < new Date() ? "Passé" : "Publié"
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<UpcomingEvent | "new" | null>(null)

  const loadEvents = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(db, EVENTS_COLLECTION), orderBy("startsAt", "desc")))
      setEvents(snapshot.docs.map(toUpcomingEvent))
      setError("")
    } catch {
      setError("Impossible de charger les événements.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleDelete = async (event: UpcomingEvent) => {
    if (!window.confirm(`Supprimer « ${event.title} » ? Cette action est définitive.`)) return

    try {
      await deleteDoc(doc(db, EVENTS_COLLECTION, event.id))
      await deleteObject(ref(storage, event.imagePath)).catch(() => {})
      await loadEvents()
    } catch {
      setError("La suppression a échoué.")
    }
  }

  if (editing) {
    return (
      <EventForm
        event={editing === "new" ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          await loadEvents()
          setEditing(null)
        }}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-light tracking-tight instrument">Événements</h1>
        <Button onClick={() => setEditing("new")}>Nouvel événement</Button>
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-sm mb-4">
          {error}
        </p>
      )}
      {!isLoading && !error && events.length === 0 && (
        <p className="text-white/60 text-sm">Aucun événement pour le moment.</p>
      )}

      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-xl border border-white/10"
          >
            <img src={event.image} alt="" className="w-full sm:w-28 h-32 sm:h-20 rounded-lg object-cover" />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-medium truncate">{event.title}</p>
              <p className="text-white/60 text-sm">
                {formatEventDate(event.startsAt)} · {getStatus(event)}
              </p>
              <EventPrice event={event} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(event)}>
                Modifier
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}>
                Supprimer
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
