import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { event_attendees, users } from "@/src/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newEvent = await db
      .insert(events)
      .values({
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
        isFeatured: body.isFeatured || false,

        // 👇 new
        userId: body.userId, // frontend se bhejna
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, event: newEvent[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const allEvents = await db.select().from(events);
//     return NextResponse.json(allEvents);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
//   }
// }
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // optional filter for user's events
    const status = url.searchParams.get("status"); // optional filter for status

    const conditions: any[] = [];
    if (userId) conditions.push(eq(events.userId, Number(userId)));
    if (status) conditions.push(eq(events.status, status));

    // 🟢 1️⃣ Fetch events (optionally filtered by userId)
    let allEvents;
   if (conditions.length > 0) {
      allEvents = await db
        .select()
        .from(events)
        .where(and(...conditions));
    } else {
      allEvents = await db.select().from(events);
    }

    // 🟢 2️⃣ Attach attendees and organizer info
    const eventsWithDetails = await Promise.all(
      allEvents.map(async (event) => {
        // fetch attendees for this event
        const attendees = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            fatherName: users.fatherName,
            motherName: users.motherName,
            address: users.address,
            city: users.city,
            profession: users.profession,
            designation: users.designation,
          })
          .from(event_attendees)
          .innerJoin(users, eq(event_attendees.userId, users.id))
          .where(eq(event_attendees.eventId, event.id));

        // fetch event organizer details
        const organizerInfo = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            fatherName: users.fatherName,
            motherName: users.motherName,
            address: users.address,
            city: users.city,
            profession: users.profession,
            designation: users.designation,
            role: users.role,
            status: users.status,
          })
          .from(users)
          .where(eq(users.id, (event.userId as number) || 0))
          .limit(1);

        return {
          ...event,
          attendees,
          attendeesCount: attendees.length,
          organizerInfo: organizerInfo[0] || null, // full organizer details
        };
      })
    );

    return NextResponse.json(eventsWithDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
