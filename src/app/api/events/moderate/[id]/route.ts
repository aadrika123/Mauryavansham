import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { events } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    const body = await req.json();

    const updated = await db
      .update(events)
      .set({
        status: body.status,
        isFeatured: body.isFeatured ?? false,
        reason: body.reason || null,
        rejectedBy: body.rejectedBy || null
      })
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}
