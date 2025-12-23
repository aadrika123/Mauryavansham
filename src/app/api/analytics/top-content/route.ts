import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { blogs, events, discussions } from "@/src/drizzle/schema"
import { eq, sql, desc } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const topBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        views: blogs.views,
        createdAt: blogs.createdAt,
        status: blogs.status,
      })
      .from(blogs)
      .where(eq(blogs.authorId, userId))
      .orderBy(desc(sql`CAST(${blogs.views} AS INTEGER)`))
      .limit(5)

    const topEvents = await db
      .select({
        id: events.id,
        title: events.title,
        maxAttendees: events.maxAttendees,
        date: events.date,
        status: events.status,
      })
      .from(events)
      .where(eq(events.userId, userId))
      .orderBy(desc(sql`CAST(${events.maxAttendees} AS INTEGER)`))
      .limit(5)

    const topDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        replyCount: discussions.replyCount,
        createdAt: discussions.createdAt,
        status: discussions.status,
      })
      .from(discussions)
      .where(eq(discussions.userId, userId))
      .orderBy(desc(sql`CAST(${discussions.replyCount} AS INTEGER)`))
      .limit(5)

    return NextResponse.json({
      topContent: {
        blogs: topBlogs || [],
        events: topEvents || [],
        discussions: topDiscussions || [],
      },
    })
  } catch (error) {
    console.error("Analytics top content error:", error)
    return NextResponse.json({ error: "Failed to fetch top content" }, { status: 500 })
  }
}
