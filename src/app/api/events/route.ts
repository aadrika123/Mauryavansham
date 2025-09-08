import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEvent = await db.insert(events).values({
      title: body.title,
      description: body.description,
      image: body.image,
      date: body.date,
      // time: body.time,
      fromTime: body.fromTime,
      toTime: body.toTime,
      location: body.location,
      maxAttendees: body.maxAttendees,
      organizer: body.organizer,
      type: body.type,
      category: body.category,
      isFeatured: body.isFeatured || false,
    }).returning();

    return NextResponse.json({ success: true, event: newEvent[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allEvents = await db.select().from(events);
    return NextResponse.json(allEvents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
