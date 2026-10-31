import type { Metadata } from "next"
import AdminApp from "@/components/admin/admin-app"

export const metadata: Metadata = {
  title: "Administration | SuperSample Paris",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminApp />
}
