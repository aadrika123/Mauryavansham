"use server";

import { db } from "@/src/drizzle/db";
import { transformDatabaseProfilesToProfiles } from "../utils/transformProfile";
import { DatabaseProfile } from "../type";

export async function getAllProfiles() {
  try {
    // Query with the correct type
    const allProfiles: DatabaseProfile[] = await db.query.profiles.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    })

    console.log("Fetched profiles from database:", allProfiles)

    // Transform database profiles to UI profiles
    const transformedProfiles = transformDatabaseProfilesToProfiles(allProfiles)

    console.log("Transformed profiles for UI:", transformedProfiles.length)

    return {
      success: true,
      data: transformedProfiles,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
      timestamp: Date.now(),
      data: [],
    }
  }
}
