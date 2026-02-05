import EventsClient from './events-client';
import { db } from '@/src/drizzle/db';
import { events } from '@/src/drizzle/db/schemas/events';
import { event_attendees, users } from '@/src/drizzle/schema';
import { authOptions } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';

export default async function EventsPage() {
  try {
    // 🔹 Fetch only approved events
    const approvedEvents = await db.select().from(events).where(eq(events.status, 'approved'));

    // 🔹 Fetch attendees for each event
    const eventsWithAttendees = await Promise.all(
      approvedEvents.map(async event => {
        const attendees = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email
          })
          .from(event_attendees)
          .innerJoin(users, eq(event_attendees.userId, users.id))
          .where(eq(event_attendees.eventId, event.id));

        return {
          ...event,
          attendees,
          attendeesCount: attendees.length
        };
      })
    );

    // 🔹 Fetch session (will be null if not logged in)
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (err) {
      console.warn('Session not available:', err);
    }

    return <EventsClient initialEvents={eventsWithAttendees} user={session?.user || null} />;
  } catch (err) {
    console.error('Failed to fetch events:', err);
    // fallback empty state
    return <EventsClient initialEvents={[]} user={null} />;
  }
}
