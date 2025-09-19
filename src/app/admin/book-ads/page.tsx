import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdsList from "./ads-list"
import { authOptions } from "@/src/lib/auth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"

export default async function AdsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/admin/overview" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>My Ads</span>
        </div>
      </div>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ads</h1>
          <p className="text-gray-600 mt-2">Manage your banner advertisements and track their status</p>
        </div>
      </div>

      <AdsList userId={session.user.id} />
    </div>
    </AdmindashboardLayout>
  )
}
