"use client"

import { useEffect, useState, type FormEvent } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import EventsDashboard from "@/components/admin/events-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase-admin-client"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError("E-mail ou mot de passe incorrect.")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-24 space-y-4">
      <h1 className="text-3xl font-light tracking-tight instrument">Administration</h1>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        Se connecter
      </Button>
    </form>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      // Force la lecture du jeton pour voir tout de suite un accès admin qui vient d'être donné.
      const token = await nextUser?.getIdTokenResult(true)
      setUser(nextUser)
      setIsAdmin(token?.claims.admin === true)
      setIsReady(true)
    })
  }, [])

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto [--input:oklch(0.4_0_0)]">
        {isReady && !user && <LoginForm />}

        {user && (
          <div className="flex items-center justify-between gap-4 mb-8">
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            <Button variant="ghost" size="sm" onClick={() => signOut(auth)}>
              Se déconnecter
            </Button>
          </div>
        )}

        {user && !isAdmin && <p role="alert">Ce compte n'a pas accès à l'administration.</p>}
        {user && isAdmin && <EventsDashboard />}
      </div>
    </div>
  )
}
