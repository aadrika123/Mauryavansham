import EventsClient from "./events-client";
import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { event_attendees, users } from "@/src/drizzle/schema";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

export default async function EventsPage() {
  const allEvents = await db.select().from(events);
  const eventsWithAttendees = await Promise.all(
    allEvents.map(async (event) => {
      const attendees = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          // image: users.image,
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
  const session = await getServerSession(authOptions);

  console.log("allEvents:", allEvents);
  console.log("allEvents:", eventsWithAttendees);

  return <EventsClient initialEvents={eventsWithAttendees} user={session?.user} />;
}
