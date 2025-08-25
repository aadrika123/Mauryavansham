import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { db } from "@/src/drizzle/db"
import { blogs, users } from "@/src/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")

    let query = db
      .select({
        id: blogs.id,
        title: blogs.title,
        summary: blogs.summary,
        content: blogs.content,
        imageUrl: blogs.imageUrl,
        status: blogs.status,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        approvedAt: blogs.approvedAt,
        rejectionReason: blogs.rejectionReason,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(desc(blogs.createdAt))

    // Filter by user if specified (for user's own blogs)
    if (userId) {
      query = query.where(eq(blogs.authorId, userId))
    }

    // Filter by status if specified
    if (status) {
      query = query.where(eq(blogs.status, status as any))
    }

    const result = await query

    return NextResponse.json({ blogs: result })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, summary, action, imageUrl } = body

    if (!title || !content || !summary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const status = action === "submit" ? "pending" : "draft"

    const [newBlog] = await db
      .insert(blogs)
      .values({
        title,
        content,
        summary,
        authorId: session.user.id,
        status,
        imageUrl: imageUrl || null,
      })
      .returning()

    return NextResponse.json({ blog: newBlog }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
