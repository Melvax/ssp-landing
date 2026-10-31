import { getApps, initializeApp } from "firebase/app"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore/lite"

export const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"

// Ces valeurs identifient le projet et sont publiques : la sécurité repose sur les règles Firebase.
const productionConfig = {
  apiKey: "AIzaSyDmRu3SmvuFLZzClF-OGq37Tuog3DR7C_c",
  authDomain: "supersample-paris.firebaseapp.com",
  projectId: "supersample-paris",
  storageBucket: "supersample-paris.firebasestorage.app",
  appId: "1:332757736232:web:70cf3c74ba23d57eb54e1d",
}

// Un projet "demo-" ne peut jamais atteindre la production.
const emulatorConfig = {
  ...productionConfig,
  authDomain: "demo-supersample.firebaseapp.com",
  projectId: "demo-supersample",
  storageBucket: "demo-supersample.appspot.com",
}

export const firebaseApp = getApps()[0] ?? initializeApp(useEmulators ? emulatorConfig : productionConfig)

export const db = getFirestore(firebaseApp)

if (useEmulators) {
  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8081)
  } catch {
    // Déjà connecté : le module est réévalué au rechargement à chaud.
  }
}
