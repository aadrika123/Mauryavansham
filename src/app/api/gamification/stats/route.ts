import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { userReputation, userBadges } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);

    // Fetch user reputation data
    let reputation = await db.query.userReputation.findFirst({
      where: eq(userReputation.userId, userId)
    });

    // If no reputation exists, create one
    if (!reputation) {
      const [newReputation] = await db
        .insert(userReputation)
        .values({
          userId,
          totalPoints: 0,
          level: 1,
          rank: 'Newcomer'
        })
        .returning();
      reputation = newReputation;
    }

    // Fetch earned badges
    const earnedBadges = await db.query.userBadges.findMany({
      where: eq(userBadges.userId, userId),
      orderBy: (badges, { desc }) => [desc(badges.earnedAt)]
    });

    // Map badges to badge types
    const earnedBadgeTypes = earnedBadges.map(b => b.badgeType);

    return NextResponse.json({
      totalPoints: reputation.totalPoints,
      level: reputation.level,
      rank: reputation.rank,
      earnedBadges: earnedBadgeTypes,
      contributions: {
        profilesViewed: reputation.profilesViewed,
        eventsAttended: reputation.eventsAttended,
        eventsCreated: reputation.eventsCreated,
        postsCreated: reputation.postsCreated,
        commentsAdded: reputation.commentsAdded,
        familyTreeMembers: reputation.familyTreeMembers,
        referrals: reputation.referrals
      },
      streak: reputation.streak,
      longestStreak: reputation.longestStreak,
      globalRank: reputation.globalRank,
      communityRank: reputation.communityRank
    });
  } catch (error) {
    console.error('[v0] Error fetching gamification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
