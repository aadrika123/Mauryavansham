import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { userBadges, userReputation } from "@/src/drizzle/schema"
import { eq } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)

    // Fetch user's earned badges
    const earnedBadges = await db.query.userBadges.findMany({
      where: eq(userBadges.userId, userId),
      orderBy: (badges, { desc }) => [desc(badges.earnedAt)],
    })

    return NextResponse.json({ badges: earnedBadges })
  } catch (error) {
    console.error("[v0] Error fetching badges:", error)
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()

    const { badgeType, badgeName, badgeDescription, badgeIcon, badgeColor, pointsEarned, requirement } = body

    if (!badgeType || !badgeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert new badge
    const [newBadge] = await db
      .insert(userBadges)
      .values({
        userId,
        badgeType,
        badgeName,
        badgeDescription,
        badgeIcon,
        badgeColor,
        pointsEarned: pointsEarned || 0,
        requirement,
      })
      .returning()

    // Update user reputation points
    if (pointsEarned > 0) {
      const [reputation] = await db.select().from(userReputation).where(eq(userReputation.userId, userId))

      if (reputation) {
        const newPoints = reputation.totalPoints + pointsEarned
        await db
          .update(userReputation)
          .set({
            totalPoints: newPoints,
            lastPointsEarned: new Date(),
          })
          .where(eq(userReputation.userId, userId))
      }
    }

    return NextResponse.json({ badge: newBadge })
  } catch (error) {
    console.error("[v0] Error awarding badge:", error)
    return NextResponse.json({ error: "Failed to award badge" }, { status: 500 })
  }
}
