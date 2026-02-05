import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { events } from '@/src/drizzle/schema'; // ⚡ आपके events table schema
import { eq } from 'drizzle-orm';

// ✅ GET /api/events/my-events/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
    }

    // ⚡ DB से event fetch
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId)
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/events/my-events/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
    }

    const body = await req.json();

    // ⚡ सिर्फ pending events ही update हो सकते हैं
    const existingEvent = await db.query.events.findFirst({
      where: eq(events.id, eventId)
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (
      existingEvent.status !== 'pending' &&
      existingEvent.status !== 'approved'
    ) {
      return NextResponse.json(
        { error: 'Only pending or approved events can be edited' },
        { status: 403 }
      );
    }

    const updatedEvent = await db
      .update(events)
      .set({
        title: body.title,
        description: body.description,
        image: body.image,
        date: body.date,
        fromTime: body.fromTime,
        toTime: body.toTime,
        location: body.location,
        maxAttendees: body.maxAttendees,
        organizer: body.organizer,
        type: body.type,
        category: body.category,
        isFeatured: body.isFeatured
      })
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json(updatedEvent[0], { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}
