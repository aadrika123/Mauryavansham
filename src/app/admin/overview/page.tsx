import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import AdminOverview from "./admin-overview"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || (session.user.role !== "admin" && session.user.role !== "superAdmin")) {
    redirect("/sign-in")
  }

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-600 mt-2">Content moderation and system statistics</p>
      </div>

      <AdminOverview />
    </div>
    </AdmindashboardLayout>
  )
}
