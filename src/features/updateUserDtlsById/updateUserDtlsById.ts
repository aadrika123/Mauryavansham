"use server";

import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { userChildren, users, userSiblings } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type createUserState = {
  success: boolean;
  message: string;
  data?: any;
  timestamp: number;
  toast?: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  };
  errors?: z.ZodIssue[];
};

export async function updateUserDtlsById(
  formData: Record<string, any>,
  id: string
): Promise<createUserState> {
  try {
    const updatedFields: Record<string, any> = {};
    const siblings: any[] = formData.siblings || [];
    const children: any[] = formData.children || [];

    for (const [key, value] of Object.entries(formData)) {
      if (!["id", "siblings", "children"].includes(key)) {
        updatedFields[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      await db
        .update(users)
        .set({ ...updatedFields, updatedAt: new Date() })
        .where(eq(users.id, Number(id)));
    }

    // 🔹 First delete old siblings/children
    await db.delete(userSiblings).where(eq(userSiblings.userId, Number(id)));
    await db.delete(userChildren).where(eq(userChildren.userId, Number(id)));

    // 🔹 Insert new siblings
    if (siblings.length > 0) {
      await db.insert(userSiblings).values(
        siblings.map((s) => ({
          userId: Number(id),
          name: s.name,
          dateOfBirth: s.dateOfBirth || null,
          gender: s.gender || null,
          maritalStatus: s.maritalStatus || null,
          spouseName: s.spouseName || null,
        }))
      );
    }

    // 🔹 Insert new children
    if (children.length > 0) {
      await db.insert(userChildren).values(
        children.map((c) => ({
          userId: Number(id),
          name: c.name,
          // dob: c.dateOfBirth ? new Date(c.dob) : null,
          dateOfBirth: c.dateOfBirth || null,
          gender: c.gender || null,
          studyingOrWorking: c.studyingOrWorking || null,
          maritalStatus: c.maritalStatus || null,
          spouseName: c.spouseName || null,
        }))
      );
    }

    const updatedProfile = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

    revalidatePath(`/user-profile/${id}`);

    return {
      success: true,
      message: "Profile updated successfully with family details!",
      data: updatedProfile[0],
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile.",
      timestamp: Date.now(),
    };
  }
}
