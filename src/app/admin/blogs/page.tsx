import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import AdminBlogsList from "./admin-blogs-list"
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout"

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || (session.user.role !== "admin" && session.user.role !== "superAdmin")) {
    redirect("/admin")
  }

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Moderation</h1>
        <p className="text-gray-600 mt-2">Review and moderate blog submissions</p>
      </div>

      <AdminBlogsList />
    </div>
    </AdmindashboardLayout>
  )
}
