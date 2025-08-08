// getProfileById.ts
import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { eq } from "drizzle-orm";

export async function getProfileById(userId: string) {
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId));

  if (!result.length) {
    return { success: false, message: "Profile not found." };
  }

  return { success: true, data: result[0] };
}
