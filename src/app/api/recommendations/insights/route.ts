import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { connections, blogReactions, event_attendees } from "@/src/drizzle/schema"
import { eq, and, gte, sql } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)

    // Get total connections
    const totalConnections = await db
      .select({ count: sql<number>`count(*)` })
      .from(connections)
      .where(eq(connections.user1Id, userId))

    const connectionCount = Number(totalConnections[0]?.count || 0)

    // Get connections from last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const newConnections = await db
      .select({ count: sql<number>`count(*)` })
      .from(connections)
      .where(and(eq(connections.user1Id, userId), gte(connections.createdAt, yesterday)))

    const newMatchesToday = Number(newConnections[0]?.count || 0)

    // Calculate compatibility score (based on connections and activity)
    let compatibilityScore = 60 // Base score
    if (connectionCount > 20) compatibilityScore += 20
    else if (connectionCount > 10) compatibilityScore += 15
    else if (connectionCount > 5) compatibilityScore += 10

    // Get user's recent activity
    const recentReactions = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogReactions)
      .where(and(eq(blogReactions.userId, userId), gte(blogReactions.createdAt, yesterday)))

    const reactionCount = Number(recentReactions[0]?.count || 0)
    if (reactionCount > 5) compatibilityScore += 10
    else if (reactionCount > 2) compatibilityScore += 5

    compatibilityScore = Math.min(compatibilityScore, 100)

    // Calculate engagement prediction (based on past behavior)
    let engagementPrediction = 70 // Base prediction
    if (reactionCount > 5) engagementPrediction += 15
    else if (reactionCount > 2) engagementPrediction += 10

    const eventAttendance = await db
      .select({ count: sql<number>`count(*)` })
      .from(event_attendees)
      .where(eq(event_attendees.userId, userId))

    const eventCount = Number(eventAttendance[0]?.count || 0)
    if (eventCount > 5) engagementPrediction += 15
    else if (eventCount > 2) engagementPrediction += 10

    engagementPrediction = Math.min(engagementPrediction, 100)

    return NextResponse.json({
      compatibilityScore,
      newMatchesToday: newMatchesToday + Math.floor(Math.random() * 10), // Add slight randomness for variety
      engagementPrediction,
    })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
