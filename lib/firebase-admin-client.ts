import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { firebaseApp, useEmulators } from "@/lib/firebase"

export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)

if (useEmulators) {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
    connectStorageEmulator(storage, "127.0.0.1", 9199)
  } catch {
    // Déjà connecté : le module est réévalué au rechargement à chaud.
  }
}
