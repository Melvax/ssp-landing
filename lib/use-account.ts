"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-admin-client"
import { getRole, type Role } from "@/lib/roles"

export function useAccount() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      // Force la lecture du jeton pour voir tout de suite un rôle qui vient d'être donné.
      const token = await nextUser?.getIdTokenResult(true).catch(() => null)
      if (nextUser && !token) {
        // Session expirée ou compte supprimé : on repart du formulaire de connexion.
        await signOut(auth)
        return
      }

      setUser(nextUser)
      setRole(nextUser && token ? getRole(nextUser, token) : null)
      setIsReady(true)
    })
  }, [])

  return { user, role, isReady }
}
