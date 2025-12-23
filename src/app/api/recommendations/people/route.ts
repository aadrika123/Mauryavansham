import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { users, connections } from "@/src/drizzle/schema"
import { eq, and, not, inArray, sql } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)

    // Get user's existing connections
    const userConnections = await db
      .select({ connectedUserId: connections.user2Id })
      .from(connections)
      .where(eq(connections.user1Id, userId))

    const connectedUserIds = userConnections.map((c) => c.connectedUserId)

    // Get users from same city/state (not already connected)
    const locationBasedUsers = await db
      .select({
        id: users.id,
        name: users.name,
        photo: users.photo,
        city: users.city,
        state: users.state,
        profileViews: users.profileViews,
        isPremium: users.isPremium,
        isVerified: users.isVerified,
      })
      .from(users)
      .where(
        and(
          not(eq(users.id, userId)),
          connectedUserIds.length > 0 ? not(inArray(users.id, connectedUserIds)) : undefined,
          eq(users.isActive, true),
          eq(users.isApproved, true),
        ),
      )
      .limit(10)

    // Calculate match scores and common connections
    const recommendedPeople = await Promise.all(
      locationBasedUsers.map(async (user) => {
        // Find mutual connections
        const mutualConnections = await db
          .select({ count: sql<number>`count(*)` })
          .from(connections)
          .where(
            and(
              eq(connections.user1Id, user.id),
              connectedUserIds.length > 0 ? inArray(connections.user2Id, connectedUserIds) : undefined,
            ),
          )

        const mutualCount = Number(mutualConnections[0]?.count || 0)

        // Calculate match score based on various factors
        let matchScore = 60 // Base score

        // Same city = +20 points
        const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        if (user.city === currentUser[0]?.city) matchScore += 20

        // Same state = +10 points
        if (user.state === currentUser[0]?.state) matchScore += 10

        // Mutual connections = +2 points each (max 10)
        matchScore += Math.min(mutualCount * 2, 10)

        // Cap at 100
        matchScore = Math.min(matchScore, 100)

        // Determine reason
        let reason = "Active community member"
        if (user.city === currentUser[0]?.city) {
          reason = `Same city: ${user.city}`
        } else if (user.state === currentUser[0]?.state) {
          reason = `Same state: ${user.state}`
        }
        if (mutualCount > 0) {
          reason = `${mutualCount} mutual connections, ${reason}`
        }

        return {
          id: user.id,
          name: user.name || "Unknown",
          location: `${user.city || ""}, ${user.state || ""}`.trim().replace(/^,|,$/g, "") || "Location not set",
          commonConnections: mutualCount,
          matchScore,
          reason,
          avatar: user.photo || null,
          isPremium: user.isPremium,
          isVerified: user.isVerified,
        }
      }),
    )

    // Sort by match score
    recommendedPeople.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json(recommendedPeople.slice(0, 8))
  } catch (error) {
    console.error("Error fetching people recommendations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
