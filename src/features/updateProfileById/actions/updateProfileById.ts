"use server";

import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type CreateProfileState = {
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

export async function updateProfileById(
  formData: FormData,
  userId: string
): Promise<CreateProfileState> {
  try {
    const updatedFields: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key !== "userId") {
        updatedFields[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return {
        success: false,
        message: "No data to update.",
        timestamp: Date.now(),
        data: null,
        toast: {
          type: "warning",
          title: "No Changes",
          message: "No fields were provided for update.",
        },
      };
    }

    await db
      .update(profiles)
      .set({ ...updatedFields, updatedAt: new Date() })
      .where(eq(profiles.userId, userId));

    const updatedProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    revalidatePath(`/view-profile/${userId}`);
    revalidatePath(`/edit-profile/${userId}`);

    return {
      success: true,
      message: "Profile updated successfully!",
      data: updatedProfile[0],
      timestamp: Date.now(),
      toast: {
        type: "success",
        title: "Profile Updated",
        message: "Your profile changes have been saved.",
      },
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile.",
      timestamp: Date.now(),
      toast: {
        type: "error",
        title: "Update Failed",
        message: "There was an error updating your profile.",
      },
    };
  }
}
