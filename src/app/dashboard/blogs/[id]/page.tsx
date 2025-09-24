import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/src/drizzle/db"
import { blogs, users } from "@/src/drizzle/schema"
import { eq } from "drizzle-orm"
import BlogDetail from "./blog-detail"
import DashboardLayout from "@/src/components/layout/dashboardLayout"
import { authOptions } from "@/src/lib/auth"

interface BlogPageProps {
  params: { id: string }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const [blog] = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      content: blogs.content,
      summary: blogs.summary,
      status: blogs.status,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      approvedAt: blogs.approvedAt,
      rejectionReason: blogs.rejectionReason,
      imageUrl: blogs.imageUrl,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(blogs)
    .leftJoin(users, eq(blogs.authorId, users.id))
    .where(eq(blogs.id, Number(params.id)))

  if (!blog) {
    redirect("/dashboard/blogs")
  }


  return (
    <DashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BlogDetail blog={blog} currentUserId={session.user.id} userRole={session.user.role} />
    </div>
    </DashboardLayout>
  )
}
