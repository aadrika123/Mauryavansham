import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { blogReactions, discussionLikes, discussionReplyLikes, messages } from "@/src/drizzle/schema"
import { eq, sql, and } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = String(session.user.id)

    const [blogLikes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogReactions)
      .where(and(eq(blogReactions.userId, userId), eq(blogReactions.isLiked, true)))

    const [blogComments] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogReactions)
      .where(and(eq(blogReactions.userId, userId), sql`${blogReactions.comment} IS NOT NULL`))

    const [discussionLikesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(discussionLikes)
      .where(eq(discussionLikes.userId, userId))

    const [replyLikesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(discussionReplyLikes)
      .where(eq(discussionReplyLikes.userId, userId))

    const userIdInt = Number.parseInt(userId)
    const [sentMessages] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.senderId, userIdInt))

    const totalLikes = Number(blogLikes.count) + Number(discussionLikesCount.count) + Number(replyLikesCount.count)
    const totalComments = Number(blogComments.count)
    const totalMessages = Number(sentMessages.count)
    const totalShares = 0 // Add if share functionality exists

    return NextResponse.json({
      engagement: {
        breakdown: {
          likes: totalLikes,
          comments: totalComments,
          shares: totalShares,
          messages: totalMessages,
        },
        total: totalLikes + totalComments + totalShares + totalMessages,
      },
    })
  } catch (error) {
    console.error("[v0] Engagement detail analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch engagement data" }, { status: 500 })
  }
}
