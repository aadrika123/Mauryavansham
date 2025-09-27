import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/src/drizzle/db"
import { blogs } from "@/src/drizzle/schema"
import { eq } from "drizzle-orm"
import EditBlogForm from "./edit-blog-form"
import DashboardLayout from "@/src/components/layout/dashboardLayout"
import { authOptions } from "@/src/lib/auth"

interface EditBlogPageProps {
  params: { id: string }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await getServerSession(authOptions)
  

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

 const [blog] = await db
  .select()
  .from(blogs)
  .where(eq(blogs.id, Number(params.id)));


  if (!blog) {
    redirect("/dashboard/blogs")
  }

  // Users can only edit their own blogs
  // if (blog.authorId !== session.user.id) {
  //   redirect("/dashboard/blogs")
  // }

  // Can only edit draft or rejected blogs
  if (blog.status !== "draft" && blog.status !== "rejected" && blog.status !== "pending") {
    redirect(`/dashboard/blogs/${blog.id}`)
  }

  return (
    <DashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <p className="text-gray-600 mt-2">Update your blog post</p>
      </div>

      <EditBlogForm blog={blog} />
    </div>
    </DashboardLayout>
  )
}
