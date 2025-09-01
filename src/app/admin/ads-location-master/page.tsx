import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/src/lib/auth"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"
import AdsLocationMasterPage from "./adsLocationMaster"

export default async function AdsLocationMasterIndex({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <AdsLocationMasterPage  />
    </div>
    </AdmindashboardLayout>
  )
}
