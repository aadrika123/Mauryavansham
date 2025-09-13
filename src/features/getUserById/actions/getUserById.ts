// getProfileById.ts
import { db } from "@/src/drizzle/db";
import { userChildren, users, userSiblings } from "@/src/drizzle/schema";
// import { userSiblings, userChildren } from "@/src/drizzle/db/schemas/relations.schema";
import { eq } from "drizzle-orm";

export async function getUserById(id: string) {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (!userResult.length) {
    return { success: false, message: "Profile not found." };
  }

  const siblings = await db
    .select()
    .from(userSiblings)
    .where(eq(userSiblings.userId, Number(id)));

  const children = await db
    .select()
    .from(userChildren)
    .where(eq(userChildren.userId, Number(id)));

  return {
    success: true,
    data: {
      ...userResult[0],
      siblings,
      children,
    },
  };
}
