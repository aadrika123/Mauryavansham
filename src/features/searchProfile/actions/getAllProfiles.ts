"use server";

import { db } from "@/src/drizzle/db";
import { transformDatabaseProfilesToProfiles } from "../utils/transformProfile";
import { DatabaseProfile } from "../type";
import { eq, and } from "drizzle-orm";

export async function getAllProfiles(userId: number) {
  try {
    // Query with filter: userId match, is_active = true AND is_deleted = false
    const allProfiles: DatabaseProfile[] = await db.query.profiles.findMany({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.userId, String(userId)), // ✅ match logged-in user
          eq(fields.isActive, true),
          eq(fields.isDeleted, false)
        ),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });

    console.log("Fetched profiles from database:", allProfiles);

    // Transform database profiles to UI profiles
    const transformedProfiles = transformDatabaseProfilesToProfiles(allProfiles);

    console.log("Transformed profiles for UI:", transformedProfiles);

    return {
      success: true,
      data: transformedProfiles,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      timestamp: Date.now(),
      data: [],
    };
  }
}
