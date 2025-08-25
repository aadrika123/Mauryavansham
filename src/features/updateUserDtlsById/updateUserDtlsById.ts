"use server";

import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { users } from "@/src/drizzle/schema";
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
  formData: Record<string, any>, // ✅ fixed
  id: string
): Promise<createUserState> {
  try {
    const updatedFields: Record<string, any> = {}

    for (const [key, value] of Object.entries(formData)) {
      if (key !== "id") {
        updatedFields[key] = typeof value === "string" ? value.trim() : value
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return {
        success: false,
        message: "No data to update.",
        timestamp: Date.now(),
        data: null,
      }
    }

    await db
      .update(users)
      .set({ ...updatedFields, updatedAt: new Date() })
      .where(eq(users.id, Number(id)))

    const updatedProfile = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1)

    revalidatePath(`/user-profile/${id}`)

    return {
      success: true,
      message: "Profile updated successfully!",
      data: updatedProfile[0],
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: "Failed to update profile.",
      timestamp: Date.now(),
    }
  }
}


