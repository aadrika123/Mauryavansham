import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { events, event_attendees } from '@/src/drizzle/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const [attendedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(event_attendees)
      .where(eq(event_attendees.userId, userId));

    const [createdCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.userId, userId));

    const today = new Date();
    const [upcomingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(and(gte(events.date, today as any), eq(events.status, 'approved' as any)));

    const attendedEventIds = await db
      .select({ eventId: event_attendees.eventId })
      .from(event_attendees)
      .where(eq(event_attendees.userId, userId));

    const attendedIds = attendedEventIds.map(e => e.eventId);

    const [invitationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(
        and(
          gte(events.date, today as any),
          eq(events.status, 'approved' as any),
          attendedIds.length > 0 ? sql`${events.id} NOT IN (${sql.join(attendedIds, sql`, `)})` : sql`true`
        )
      );

    return NextResponse.json({
      events: {
        attended: Number(attendedCount.count) || 0,
        created: Number(createdCount.count) || 0,
        upcoming: Number(upcomingCount.count) || 0,
        invitations: Number(invitationsCount.count) || 0
      }
    });
  } catch (error) {
    console.error('[v0] Events analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch events data' }, { status: 500 });
  }
}
