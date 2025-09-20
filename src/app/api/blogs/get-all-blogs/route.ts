import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { blogs, users } from "@/src/drizzle/schema"
import { db } from "@/src/drizzle/db"

export async function GET(request: NextRequest) {
  try {
    const result = await db
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
      .where(eq(blogs.status, "approved")) // ✅ sirf approved blogs
      .orderBy(blogs.createdAt)

    return NextResponse.json({ blogs: result })
  } catch (error) {
    console.error("Error fetching approved blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
