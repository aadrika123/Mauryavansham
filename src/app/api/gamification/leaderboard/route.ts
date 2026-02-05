import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { userReputation, users } from '@/src/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    // Fetch top users by total points
    const leaderboard = await db
      .select({
        userId: userReputation.userId,
        name: users.name,
        profilePicture: users.profilePicture,
        totalPoints: userReputation.totalPoints,
        level: userReputation.level,
        rank: userReputation.rank,
        globalRank: userReputation.globalRank
      })
      .from(userReputation)
      .innerJoin(users, eq(userReputation.userId, users.id))
      .orderBy(desc(userReputation.totalPoints))
      .limit(limit);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('[v0] Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
