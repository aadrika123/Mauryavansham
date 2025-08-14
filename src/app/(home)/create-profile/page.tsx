"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { eq, and } from "drizzle-orm";

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

export async function CreateProfilePage(
  prevState: CreateProfileState,
  formData: FormData
): Promise<CreateProfileState> {
  try {
    console.log("=== createProfile START ===");
    console.log("Incoming prevState:", prevState);
    
    // Debug: Log all form data entries
    console.log("=== FORM DATA ENTRIES ===");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("=== END FORM DATA ENTRIES ===");

    const session = await getServerSession(authOptions);
    console.log("Session:", session ? `User ID: ${session.user?.id}` : "No session");
    
    if (!session?.user?.id) {
      console.log("❌ Authentication failed");
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
      profileRelation: z.string().min(1, "Profile relation is required"),
      customRelation: z.string().optional(),
      name: z.string().min(1, "Name is required"),
      phoneNo: z.string().min(1, "Phone number is required"),
      email: z.string().email("Valid email is required"),
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
      // profileImage: z.string().optional(),
      profileImage1: z.string().optional(),
      profileImage2: z.string().optional(),
      profileImage3: z.string().optional(),
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
      marriedSiblings: z.string().optional(),
      familyType: z.string().optional(),
      familyValues: z.string().optional(),
      familyIncome: z.string().optional(),
      familyLocation: z.string().optional(),
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

    console.log("=== RAW DATA ===");
    console.log(JSON.stringify(rawData, null, 2));

    const parsed = profileSchema.safeParse(rawData);
    console.log("=== VALIDATION RESULT ===");
    console.log("Success:", parsed.success);
    
    if (!parsed.success) {
      console.log("❌ Validation errors:", parsed.error.errors);
      return {
        success: false,
        message: "Validation failed: " + parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        errors: parsed.error.errors,
        timestamp: Date.now(),
        toast: {
          type: "error",
          title: "Validation Error",
          message: "Please check the form for errors: " + parsed.error.errors[0]?.message,
        },
      };
    }

    console.log("✅ Validation passed");
    console.log("Parsed data:", JSON.stringify(parsed.data, null, 2));

    // Check if a profile with the same email already exists for this specific user
    // This prevents duplicate emails for the same user but allows multiple profiles
    console.log("=== CHECKING FOR EXISTING EMAIL ===");
    const existingProfile = await db.query.profiles.findFirst({
      where: (fields, { eq, and }) => 
        and(
          eq(fields.email, parsed.data.email),
          eq(fields.userId, session.user.id),
          eq(fields.isDeleted, false) // Only check active profiles
        ),
    });

    if (existingProfile) {
      console.log("❌ Profile with this email already exists for this user");
      return {
        success: false,
        message: "You already have a profile with this email address. Please use a different email for additional profiles.",
        data: existingProfile,
        timestamp: Date.now(),
        toast: {
          type: "error",
          title: "Duplicate Email",
          message: "You already have a profile with this email address. Please use a different email.",
        },
      };
    }

    console.log("✅ No existing profile with this email found, proceeding with creation");

    // Insert the profile
    console.log("=== INSERTING PROFILE ===");
    const result = await db.insert(profiles).values({
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log("✅ Profile created successfully:", result[0]);

    revalidatePath("/create-profile");
    revalidatePath("/dashboard");
    
    return {
      success: true,
      message: "Profile created successfully.",
      data: result[0] || parsed.data,
      timestamp: Date.now(),
      toast: {
        type: "success",
        title: "Profile Created",
        message: "Your profile has been successfully created!",
      },
    };
  } catch (error) {
    console.error("❌ Create profile error:", error);
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
