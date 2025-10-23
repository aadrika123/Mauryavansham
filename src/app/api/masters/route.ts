import { eq, ne, sql } from "drizzle-orm";
// import { db } from "@/src/db";
// import { users } from "@/src/db/schema/users";
// import { profiles } from "@/src/db/schema/profiles";
import { discussions, users, profiles } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";
// import { discussions } from "@/src/db/schema/discussions";

export async function GET() {
  try {
    // ✅ Successful Marriages
    const marriedCount = await db
      .select({ count: sql`count(*)` })
      .from(profiles)
      .where(eq(profiles.deactivateReason, "married"));

    // ✅ Registered Families
    const registeredFamiliesCount = await db
      .select({ count: sql`count(*)` })
      .from(users)
      .where(eq(users.isActive, true))
      .where(ne(users.status, "rejected"));

    // ✅ Countries Connected
    const countries = await db
      .select({ country: users.country })
      .from(users)
      .where(eq(users.isActive, true));
    const uniqueCountries = new Set(countries.map((u) => u.country)).size;

    // ✅ Forum Discussions
    const forumDiscussionsCount = await db
      .select({ count: sql`count(*)` })
      .from(discussions);

    return Response.json({
      success: true,
      data: {
        successfulMarriages: Number(marriedCount[0].count) || 0,
        registeredFamilies: Number(registeredFamiliesCount[0].count) || 0,
        countriesConnected: uniqueCountries,
        forumDiscussions: Number(forumDiscussionsCount[0].count) || 0,
      },
    });
  } catch (error) {
    console.error("Error in master stats API:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
