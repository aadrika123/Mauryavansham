import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { users, blogs, events, discussions, businesses } from '@/src/drizzle/schema';
import { eq, sql, and } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(period));

    const [userBlogsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogs)
      .where(eq(blogs.authorId, userId));

    const [userEventsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.userId, userId));

    const [userDiscussionsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(discussions)
      .where(eq(discussions.userId, userId));

    const [userBusinessesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(businesses)
      .where(eq(businesses.userId, userId));

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    const [blogViews] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(views AS INTEGER)), 0)` })
      .from(blogs)
      .where(eq(blogs.authorId, userId));

    const [eventAttendees] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST("max_attendees" AS INTEGER)), 0)` })
      .from(events)
      .where(and(eq(events.userId, userId), eq(events.status, 'approved')));

    return NextResponse.json({
      overview: {
        totalBlogs: Number(userBlogsCount.count) || 0,
        totalEvents: Number(userEventsCount.count) || 0,
        totalDiscussions: Number(userDiscussionsCount.count) || 0,
        totalBusinesses: Number(userBusinessesCount.count) || 0,
        profileViews: userProfile?.profileViews || 0,
        blogViews: Number(blogViews.total) || 0,
        eventAttendees: Number(eventAttendees.total) || 0
      },
      user: {
        isPremium: userProfile?.isPremium || false,
        isVerified: userProfile?.isVerified || false,
        memberSince: userProfile?.createdAt
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
