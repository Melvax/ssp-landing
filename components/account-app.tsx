"use client"

import Link from "next/link"
import { signOut } from "firebase/auth"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase-admin-client"
import { ROLE_LABELS } from "@/lib/roles"
import { useAccount } from "@/lib/use-account"

export default function AccountApp() {
  const { user, role, isReady } = useAccount()

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white px-6 py-8">
      <div className="max-w-sm mx-auto [--input:oklch(0.4_0_0)]">
        <Link href="/" className="text-white/60 hover:text-white text-sm">
          ← Retour au site
        </Link>

        {isReady && !user && <LoginForm title="Connexion" />}

        {user && role && (
          <div className="mt-24 space-y-4">
            <h1 className="text-3xl font-light tracking-tight instrument">Mon compte</h1>
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            <p className="text-sm">Rôle : {ROLE_LABELS[role]}</p>
            {role === "admin" && (
              <Button asChild className="w-full">
                <Link href="/admin">Administration</Link>
              </Button>
            )}
            <Button variant="ghost" className="w-full" onClick={() => signOut(auth)}>
              Se déconnecter
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
