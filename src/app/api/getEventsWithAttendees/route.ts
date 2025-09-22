import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { event_attendees } from "@/src/drizzle/db/schemas/event_attendees";
import { users } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Get all events
    const allEvents = await db.select().from(events);

    // 2. For each event, get attendees (users)
    const eventsWithAttendees = await Promise.all(
      allEvents.map(async (event) => {
        const attendees = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
          })
          .from(event_attendees)
          .innerJoin(users, eq(event_attendees.userId, users.id))
          .where(eq(event_attendees.eventId, event.id));

        return {
          ...event,
          attendees,
          attendeesCount: attendees.length, // add count here
        };
      })
    );

    return NextResponse.json(eventsWithAttendees, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
