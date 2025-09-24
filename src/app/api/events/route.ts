import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { event_attendees, users } from "@/src/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
    const userId = url.searchParams.get("userId"); // optional filter for user

    // 1️⃣ Fetch events (optionally filter by userId)
    let allEvents;
    if (userId) {
      allEvents = await db
        .select()
        .from(events)
        .where(eq(events.userId, Number(userId))); // user's events only
    } else {
      allEvents = await db.select().from(events);
    }

    // 2️⃣ Add attendees info for each event
    const eventsWithAttendees = await Promise.all(
      allEvents.map(async (event) => {
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

        return {
          ...event,
          attendees,
          attendeesCount: attendees.length,
        };
      })
    );

    return NextResponse.json(eventsWithAttendees, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
