import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/drizzle/db"
import { users, connections } from "@/src/drizzle/schema"
import { eq, sql, or, and, gte } from "drizzle-orm"
import { authOptions } from "@/src/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const [userConnections] = await db
      .select({ count: sql<number>`count(*)` })
      .from(connections)
      .where(or(eq(connections.user1Id, userId), eq(connections.user2Id, userId)))

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [newConnections] = await db
      .select({ count: sql<number>`count(*)` })
      .from(connections)
      .where(
        and(
          or(eq(connections.user1Id, userId), eq(connections.user2Id, userId)),
          gte(connections.createdAt, thirtyDaysAgo),
        ),
      )

    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users)

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    const [rankResult] = await db
      .select({ rank: sql<number>`COUNT(*) + 1` })
      .from(users)
      .where(sql`${users.profileViews} > ${userProfile?.profileViews || 0}`)

    return NextResponse.json({
      community: {
        connections: Number(userConnections.count) || 0,
        newConnections: Number(newConnections.count) || 0,
        profileRank: Number(rankResult.rank) || 1,
        totalUsers: Number(totalUsers.count) || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Community analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch community data" }, { status: 500 })
  }
}
