import { db } from '@/src/drizzle/db';
import { events } from '@/src/drizzle/db/schemas/events';
import { event_attendees } from '@/src/drizzle/db/schemas/event_attendees';
import { eq, sql, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = Number(id);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'You must be logged in' },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id); // Ensure it's a number

  try {
    // Check if user already attending
    const existing = await db
      .select()
      .from(event_attendees)
      .where(
        and(
          eq(event_attendees.eventId, eventId),
          eq(event_attendees.userId, userId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You are already attending this event' },
        { status: 400 }
      );
    }

    // Add user to event_attendees
    await db.insert(event_attendees).values({
      eventId,
      userId
    });

    // Increment attendees count
    await db
      .update(events)
      .set({ attendees: sql`${events.attendees} + 1` })
      .where(eq(events.id, eventId));

    return NextResponse.json({
      success: true,
      message: 'You are now attending this event'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
