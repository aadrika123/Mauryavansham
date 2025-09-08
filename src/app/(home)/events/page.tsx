import EventsClient from "./events-client";
import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/db/schemas/events";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";

export default async function EventsPage() {
  const allEvents = await db.select().from(events);
  const session = await getServerSession(authOptions)

  console.log("allEvents:", allEvents);
  
  return <EventsClient initialEvents={allEvents} user={session?.user} />;
}
