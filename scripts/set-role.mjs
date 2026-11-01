// Donne l'accès à /admin à un compte existant : npm run set-admin -- email@exemple.fr
// En production, il faut d'abord être connecté avec : gcloud auth application-default login
import { initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const email = process.argv[2]

if (!email) {
  console.error("Usage : npm run set-admin -- email@exemple.fr")
  process.exit(1)
}

const projectId = process.env.FIREBASE_AUTH_EMULATOR_HOST ? "demo-supersample" : "supersample-paris"

initializeApp({ projectId })

const user = await getAuth().getUserByEmail(email)
await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, admin: true })

console.log(`${email} est maintenant admin sur ${projectId}.`)
