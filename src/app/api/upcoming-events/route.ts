import { db } from "@/src/drizzle/db";
import { events } from "@/src/drizzle/schema";
import { eq, gt, and } from "drizzle-orm";

export async function GET() {
  try {
    // Get today's date (formatted as 'YYYY-MM-DD')
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0]; // ✅ Convert to string

    // Fetch only approved + upcoming events
    const approvedUpcomingEvents = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.status, "approved"),
          gt(events.date, todayStr) 
        )
      )
      .orderBy(events.date); 

    return Response.json({
      success: true,
      data: approvedUpcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return Response.json(
      { success: false, message: "Failed to fetch upcoming events" },
      { status: 500 }
    );
  }
}
