"use client"

import { useState } from "react"
import { getDownloadURL, ref } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/firebase-admin-client"

export default function TrackPlayer({ audioPath }: { audioPath: string }) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handlePlay = async () => {
    try {
      setError("")
      setUrl(await getDownloadURL(ref(storage, audioPath)))
    } catch {
      setError("Impossible de lire ce son.")
    }
  }

  if (url) return <audio src={url} controls autoPlay className="w-full" />

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handlePlay}>
        Écouter
      </Button>
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
