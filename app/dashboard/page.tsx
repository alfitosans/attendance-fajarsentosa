import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { GuruDashboard } from "@/components/guru-dashboard"
import { MuridDashboard } from "@/components/murid-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "admin" && <AdminDashboard user={user} />}
      {user.role === "guru" && <GuruDashboard user={user} />}
      {user.role === "murid" && <MuridDashboard user={user} />}
    </div>
  )
}
