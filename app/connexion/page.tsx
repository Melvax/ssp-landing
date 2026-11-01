import type { Metadata } from "next"
import AccountApp from "@/components/account-app"

export const metadata: Metadata = {
  title: "Connexion | SuperSample Paris",
  robots: { index: false, follow: false },
}

export default function ConnexionPage() {
  return <AccountApp />
}
