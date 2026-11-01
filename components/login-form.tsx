"use client"

import { useState, type FormEvent } from "react"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase-admin-client"

function getErrorMessage(error: unknown) {
  const code = (error as { code?: string }).code

  if (code === "auth/email-already-in-use") return "Un compte existe déjà avec cet e-mail."
  if (code === "auth/weak-password") return "Le mot de passe doit faire au moins 6 caractères."
  if (code === "auth/popup-closed-by-user") return ""
  if (code === "auth/popup-blocked") return "La fenêtre Google a été bloquée par le navigateur."
  return "Connexion impossible. Vérifie ton e-mail et ton mot de passe."
}

export default function LoginForm({ title, allowSignup = false }: { title: string; allowSignup?: boolean }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const authenticate = async (signIn: () => Promise<unknown>) => {
    setError("")
    setIsSubmitting(true)

    try {
      await signIn()
    } catch (signInError) {
      setError(getErrorMessage(signInError))
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const signIn = isSignup ? createUserWithEmailAndPassword : signInWithEmailAndPassword
    authenticate(() => signIn(auth, email, password))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-24 space-y-4">
      <h1 className="text-3xl font-light tracking-tight instrument">{isSignup ? "Créer un compte" : title}</h1>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        className="w-full"
        onClick={() => authenticate(() => signInWithPopup(auth, new GoogleAuthProvider()))}
      >
        Continuer avec Gmail
      </Button>
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
          autoComplete={isSignup ? "new-password" : "current-password"}
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
        {isSignup ? "Créer mon compte" : "Se connecter"}
      </Button>
      {allowSignup && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setIsSignup(!isSignup)
            setError("")
          }}
        >
          {isSignup ? "J'ai déjà un compte" : "Créer un compte"}
        </Button>
      )}
    </form>
  )
}
