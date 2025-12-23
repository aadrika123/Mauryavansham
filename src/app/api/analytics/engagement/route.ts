import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { blogs, events, discussions, blogReactions } from "@/src/drizzle/schema"
import { eq, sql, and, gte } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - days)

    const userBlogs = await db.select({ id: blogs.id }).from(blogs).where(eq(blogs.authorId, userId))

    const blogIds = userBlogs.map((b) => b.id)

    let totalReactions = 0
    if (blogIds.length > 0) {
      const [reactions] = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogReactions)
        .where(sql`${blogReactions.blogId} IN ${sql.raw(`(${blogIds.join(",")})`)}`)

      totalReactions = Number(reactions.count) || 0
    }

    const recentBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        createdAt: blogs.createdAt,
        views: blogs.views,
      })
      .from(blogs)
      .where(and(eq(blogs.authorId, userId), gte(blogs.createdAt, daysAgo)))
      .orderBy(sql`${blogs.createdAt} DESC`)
      .limit(5)

    const recentEvents = await db
      .select({
        id: events.id,
        title: events.title,
        date: events.date,
        status: events.status,
      })
      .from(events)
      .where(and(eq(events.userId, userId), gte(events.createdAt, daysAgo)))
      .orderBy(sql`${events.createdAt} DESC`)
      .limit(5)

    const recentDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        createdAt: discussions.createdAt,
        status: discussions.status,
      })
      .from(discussions)
      .where(and(eq(discussions.userId, userId), gte(discussions.createdAt, daysAgo)))
      .orderBy(sql`${discussions.createdAt} DESC`)
      .limit(5)

    return NextResponse.json({
      engagement: {
        totalReactions,
        recentBlogs: recentBlogs || [],
        recentEvents: recentEvents || [],
        recentDiscussions: recentDiscussions || [],
      },
    })
  } catch (error) {
    console.error("Analytics engagement error:", error)
    return NextResponse.json({ error: "Failed to fetch engagement data" }, { status: 500 })
  }
}
