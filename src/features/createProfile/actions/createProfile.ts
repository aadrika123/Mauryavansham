"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { eq } from "drizzle-orm";

// Return type for server actions
export type CreateProfileState = {
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

export async function createProfile(
  prevState: CreateProfileState,
  formData: FormData
): Promise<CreateProfileState> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User not authenticated.",
        timestamp: Date.now(),
        toast: {
          type: "error",
          title: "Authentication Error",
          message: "You must be logged in to create a profile.",
        },
      };
    }

    const profileSchema = z.object({
      userId: z.string(),
      name: z.string().min(1),
      phoneNo: z.string().min(1),
      email: z.string().email(),
      // All optional fields hereafter
      nickName: z.string().optional(),
      website: z.string().optional(),
      dob: z.string().optional(),
      gender: z.string().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      complexion: z.string().optional(),
      bodyType: z.string().optional(),
      maritalStatus: z.string().optional(),
      languagesKnown: z.string().optional(),
      hobbies: z.string().optional(),
      aboutMe: z.string().optional(),
      profileImage: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      diet: z.string().optional(),
      smoking: z.string().optional(),
      drinking: z.string().optional(),
      exercise: z.string().optional(),
      religiousBeliefs: z.string().optional(),
      musicPreferences: z.string().optional(),
      moviePreferences: z.string().optional(),
      readingInterests: z.string().optional(),
      travelInterests: z.string().optional(),
      castPreferences: z.string().optional(),
      gotraDetails: z.string().optional(),
      ancestralVillage: z.string().optional(),
      familyHistory: z.string().optional(),
      communityContributions: z.string().optional(),
      familyTraditions: z.string().optional(),
      fatherName: z.string().optional(),
      fatherOccupation: z.string().optional(),
      motherName: z.string().optional(),
      motherOccupation: z.string().optional(),
      brothers: z.string().optional(),
      sisters: z.string().optional(),
      familyIncome: z.string().optional(),
      highestEducation: z.string().optional(),
      collegeUniversity: z.string().optional(),
      occupation: z.string().optional(),
      companyOrganization: z.string().optional(),
      designation: z.string().optional(),
      workLocation: z.string().optional(),
      annualIncome: z.string().optional(),
      workExperience: z.string().optional(),
    });

    const formEntries = Object.fromEntries(formData.entries());
    const rawData = {
      ...formEntries,
      userId: session.user.id,
    };

    const parsed = profileSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors,
        timestamp: Date.now(),
        toast: {
          type: "error",
          title: "Validation Error",
          message: "Please check the form for errors.",
        },
      };
    }

    const exists = await db.query.profiles.findFirst({
      where: (fields, { eq }) => eq(fields.email, parsed.data.email),
    });
    if (exists) {
      return {
        success: false,
        message: "Profile already exists.",
        data: exists,
        timestamp: Date.now(),
        toast: {
          type: "error",
          title: "Profile Exists",
          message: "A profile with this email already exists.",
        },
      };
    }

    await db.insert(profiles).values({
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/create-profile");
    return {
      success: true,
      message: "Profile created successfully.",
      data: parsed.data,
      timestamp: Date.now(),
      toast: {
        type: "success",
        title: "Profile Created",
        message: "Your profile has been successfully created!",
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unexpected error.",
      timestamp: Date.now(),
      toast: {
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Unexpected error occurred.",
      },
    };
  }
}

export async function updateProfileById(formData: FormData, userId: string) {
  try {
    const updatedFields: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "userId") updatedFields[key] = value;
    }

    if (!Object.keys(updatedFields).length) {
      return {
        success: false,
        message: "No data to update.",
        data: null,
      };
    }

    await db.update(profiles).set(updatedFields).where(eq(profiles.userId, userId));

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
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update profile.",
      data: null,
    };
  }
}
