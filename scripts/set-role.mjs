// Donne un rôle à un compte existant : npm run set-role -- email@exemple.fr adherent
// En production, il faut d'abord être connecté avec : gcloud auth application-default login
import { initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const ROLES = ["admin", "viewer", "adherent", "host"]
const [email, role] = process.argv.slice(2)

if (!email || !ROLES.includes(role)) {
  console.error(`Usage : npm run set-role -- email@exemple.fr ${ROLES.join("|")}`)
  process.exit(1)
}

const projectId = process.env.FIREBASE_AUTH_EMULATOR_HOST ? "demo-supersample" : "supersample-paris"

initializeApp({ projectId })

const user = await getAuth().getUserByEmail(email)
await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, role })

console.log(`${email} a maintenant le rôle ${role} sur ${projectId}.`)
