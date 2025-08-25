// getProfileById.ts
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, Number(id)));

  if (!result.length) {
    return { success: false, message: "Profile not found." };
  }

  return { success: true, data: result[0] };
}
