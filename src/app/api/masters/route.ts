import { eq, ne, sql } from "drizzle-orm";
import { discussions, users, profiles, businesses } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";

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

    // ✅ Matrimonial Profiles (isActive true, isDeleted false)
    const matrimonialProfilesCount = await db
      .select({ count: sql`count(*)` })
      .from(profiles)
      .where(eq(profiles.isActive, true))
      .where(eq(profiles.isDeleted, false));

    // ✅ Registered Business Houses (isActive true)
    const registeredBusinessCount = await db
      .select({ count: sql`count(*)` })
      .from(businesses)
      .where(eq(businesses.isActive, true));

    // ✅ Response
    return Response.json({
      success: true,
      data: {
        successfulMarriages: Number(marriedCount[0].count) || 0,
        registeredFamilies: Number(registeredFamiliesCount[0].count) || 0,
        countriesConnected: uniqueCountries,
        forumDiscussions: Number(forumDiscussionsCount[0].count) || 0,
        matrimonialProfiles: Number(matrimonialProfilesCount[0].count) || 0,
        registeredBusinessHouses: Number(registeredBusinessCount[0].count) || 0,
      },
    });
  } catch (error) {
    console.error("Error in master stats API:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
