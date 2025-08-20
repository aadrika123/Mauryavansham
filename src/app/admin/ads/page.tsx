import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import AdminAdsList from "./admin-ads-list"
import DashboardLayout from "@/src/components/layout/dashboardLayout"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ad Moderation</h1>
        <p className="text-gray-600 mt-2">Review and moderate advertisement submissions</p>
      </div>

      <AdminAdsList />
    </div>
    </AdmindashboardLayout>
  )
}
