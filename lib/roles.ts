import type { IdTokenResult, User } from "firebase/auth"

export const ROLES = ["admin", "viewer", "adherent", "host"] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  viewer: "Viewer",
  adherent: "Adhérent",
  host: "Host",
}

// contact.supersample@gmail.com : même identifiant que dans les règles Firebase.
const ADMIN_UID = "OXJvsXVGa6fqXwmbbmjoYntZYay2"

export function getRole(user: User, token: IdTokenResult): Role {
  if (user.uid === ADMIN_UID) {
    return "admin"
  }

  const role = token.claims.role
  return ROLES.find((candidate) => candidate === role) ?? "viewer"
}
