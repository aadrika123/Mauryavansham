import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import BlogsList from "./blogs-list"
import { authOptions } from "@/src/lib/auth"
import DashboardLayout from "@/src/components/layout/dashboardLayout"

export default async function BlogsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-gray-600 mt-2">Manage your blog posts and track their approval status</p>
        </div>
      </div>

      <BlogsList userId={session.user.id} />
    </div>
    </DashboardLayout>
  )
}
