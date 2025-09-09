import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/src/lib/auth"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"
import dynamic from "next/dynamic";
// import CategoryMaster from "./discussionCategoryMater"
const CategoryMaster = dynamic(() => import("./discussionCategoryMater"), {
  ssr: false,
});
// import AdsLocationMasterPage from "./adsLocationMaster"

export default async function AdsLocationMasterIndex({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  if ((session.user.role !== "admin" && session.user.role !== "superAdmin")) {
    redirect("/sign-in")
  }

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      {/* <AdsLocationMasterPage  /> */}
      <CategoryMaster />
    </div>
    </AdmindashboardLayout>
  )
}
