// /app/api/events/applied/route.ts

import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/schema";

export async function GET() {
  try {
    const allEvents = await db.query.events.findMany({
      orderBy: (events, { desc }) => [desc(events.id)], // latest first
    });

    return NextResponse.json(allEvents, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
