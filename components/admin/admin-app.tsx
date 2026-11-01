"use client"

import { signOut } from "firebase/auth"
import EventsDashboard from "@/components/admin/events-dashboard"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase-admin-client"
import { useAccount } from "@/lib/use-account"

export default function AdminApp() {
  const { user, role, isReady } = useAccount()

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto [--input:oklch(0.4_0_0)]">
        {isReady && !user && <LoginForm title="Administration" />}

        {user && (
          <div className="flex items-center justify-between gap-4 mb-8">
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            <Button variant="ghost" size="sm" onClick={() => signOut(auth)}>
              Se déconnecter
            </Button>
          </div>
        )}

        {user && role !== "admin" && <p role="alert">Ce compte n'a pas accès à l'administration.</p>}
        {user && role === "admin" && <EventsDashboard />}
      </div>
    </div>
  )
}
