"use server";

import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/schema"; // Adjust path as needed
import { eq } from "drizzle-orm";
// import { transformToDetailedProfile } from "../utils/transformDetailedProfile"
import type { DatabaseProfile } from "../type";
import { transformToDetailedProfile } from "../utils/transformToDetailedProfile";

export async function getProfileById(userId: string) {
  try {
    const numericId = Number.parseInt(userId);
    if (isNaN(numericId)) {
      return {
        success: false,
        message: "Invalid profile ID",
        data: null,
      };
    }

    const profile: DatabaseProfile | undefined =
      await db.query.profiles.findFirst({
        where: eq(profiles.userId, numericId.toString()), // Convert to string
      });

    console.log("Fetched profile from database:", profile);

    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
        data: null,
      };
    }

    const transformedProfile = transformToDetailedProfile(profile);
    console.log("Transformed profile for UI:", transformedProfile);

    if (!transformedProfile) {
      return {
        success: false,
        message: "Unable to process profile data",
        data: null,
      };
    }

    return {
      success: true,
      data: transformedProfile,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      data: null,
    };
  }
}
