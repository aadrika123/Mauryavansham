"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/db/schemas/createProfile.schema";
import { Toast } from "@/src/components/ui/toast";
import { Toaster } from "@/src/components/ui/toaster";

export async function createProfile(formData: FormData) {
  try {
    // Zod schema validation
    const profileSchema = z.object({
      name: z.string().min(1, "Name is required"),
      nickName: z.string().optional(),
      phoneNo: z.string().min(1, "Phone number is required"),
      email: z.string().email("Invalid email address"),
      website: z.string().optional(),
      dob: z.string().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      complexion: z.string().optional(),
      bodyType: z.string().optional(),
      maritalStatus: z.string().optional(),
      languagesKnown: z.string().optional(),
      hobbies: z.string().optional(),
      aboutMe: z.string().optional(),

      // Lifestyle
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

      // Genealogy
      gotraDetails: z.string().optional(),
      ancestralVillage: z.string().optional(),
      familyHistory: z.string().optional(),
      communityContributions: z.string().optional(),
      familyTraditions: z.string().optional(),

      // Family Details
      fatherName: z.string().optional(),
      fatherOccupation: z.string().optional(),
      motherName: z.string().optional(),
      motherOccupation: z.string().optional(),
      brothers: z.string().optional(),
      sisters: z.string().optional(),
      familyIncome: z.string().optional(),

      // Education & Career
      highestEducation: z.string().optional(),
      collegeUniversity: z.string().optional(),
      occupation: z.string().optional(),
      companyOrganization: z.string().optional(),
      designation: z.string().optional(),
      workLocation: z.string().optional(),
      annualIncome: z.string().optional(),
      workExperience: z.string().optional(),
    });

    const parsedData = profileSchema.parse({
      // Personal Information
      name: (formData.get("name") as string) || "",
      nickName: (formData.get("nickName") as string) || "",
      phoneNo: (formData.get("phoneNo") as string) || "",
      email: (formData.get("email") as string) || "",
      website: (formData.get("website") as string) || "",
      dob: (formData.get("dob") as string) || "",
      height: (formData.get("height") as string) || "",
      weight: (formData.get("weight") as string) || "",
      complexion: (formData.get("complexion") as string) || "",
      bodyType: (formData.get("bodyType") as string) || "",
      maritalStatus: (formData.get("maritalStatus") as string) || "",
      languagesKnown: (formData.get("languagesKnown") as string) || "",
      hobbies: (formData.get("hobbies") as string) || "",
      aboutMe: (formData.get("aboutMe") as string) || "",

      // Lifestyle
      diet: (formData.get("diet") as string) || "",
      smoking: (formData.get("smoking") as string) || "",
      drinking: (formData.get("drinking") as string) || "",
      exercise: (formData.get("exercise") as string) || "",
      religiousBeliefs: (formData.get("religiousBeliefs") as string) || "",
      musicPreferences: (formData.get("musicPreferences") as string) || "",
      moviePreferences: (formData.get("moviePreferences") as string) || "",
      readingInterests: (formData.get("readingInterests") as string) || "",
      travelInterests: (formData.get("travelInterests") as string) || "",
      castPreferences: (formData.get("castPreferences") as string) || "",

      // Genealogy
      gotraDetails: (formData.get("gotraDetails") as string) || "",
      ancestralVillage: (formData.get("ancestralVillage") as string) || "",
      familyHistory: (formData.get("familyHistory") as string) || "",
      communityContributions:
        (formData.get("communityContributions") as string) || "",
      familyTraditions: (formData.get("familyTraditions") as string) || "",

      // Family Details
      fatherName: (formData.get("fatherName") as string) || "",
      fatherOccupation: (formData.get("fatherOccupation") as string) || "",
      motherName: (formData.get("motherName") as string) || "",
      motherOccupation: (formData.get("motherOccupation") as string) || "",
      brothers: (formData.get("brothers") as string) || "",
      sisters: (formData.get("sisters") as string) || "",
      familyIncome: (formData.get("familyIncome") as string) || "",

      // Education & Career
      highestEducation: (formData.get("highestEducation") as string) || "",
      collegeUniversity: (formData.get("collegeUniversity") as string) || "",
      occupation: (formData.get("occupation") as string) || "",
      companyOrganization:
        (formData.get("companyOrganization") as string) || "",
      designation: (formData.get("designation") as string) || "",
      workLocation: (formData.get("workLocation") as string) || "",
      annualIncome: (formData.get("annualIncome") as string) || "",
      workExperience: (formData.get("workExperience") as string) || "",
    });
    // if (!parsedData.success) {
    //   return {
    //     success: false,
    //     message: "Validation failed",
    //     errors: parsedData.error.errors,
    //     timestamp: Date.now(),
    //   };
    // }
    // ✅ Check if required fields are filled
    if (!parsedData.name || !parsedData.phoneNo || !parsedData.email) {
      return {
        success: false,
        message: "Name, Phone Number, and Email are required.",
        timestamp: Date.now(),
        Toaster: {
          type: "error",
          message: "Please fill in all required fields.",
          title: "Profile Creation Error",
        },
      };
    }

    // ✅ Check if email already exists
    const existing = await db.query.profiles.findFirst({
      where: (fields, { eq }) => eq(fields.email, parsedData.email),
    });

    if (existing) {
      return {
        success: false,
        message: "Profile already exists for this email.",
        data: existing,
        timestamp: Date.now(),
      };
    }

    // ✅ Insert data into DB
    await db.insert(profiles).values({
      // Basic Information
      name: parsedData.name.trim(),
      nickName: parsedData.nickName?.trim() || "",
      phoneNo: parsedData.phoneNo.trim(),
      email: parsedData.email.trim(),
      website: parsedData.website?.trim() || "",
      dob: parsedData.dob?.trim() || "",

      // Personal Information
      height: parsedData.height?.trim() || "",
      weight: parsedData.weight?.trim() || "",
      complexion: parsedData.complexion?.trim() || "",
      bodyType: parsedData.bodyType?.trim() || "",
      maritalStatus: parsedData.maritalStatus?.trim() || "",
      languagesKnown: parsedData.languagesKnown?.trim() || "",
      hobbies: parsedData.hobbies?.trim() || "",
      aboutMe: parsedData.aboutMe?.trim() || "",

      // Lifestyle
      diet: parsedData.diet?.trim() || "",
      smoking: parsedData.smoking?.trim() || "",
      drinking: parsedData.drinking?.trim() || "",
      exercise: parsedData.exercise?.trim() || "",
      religiousBeliefs: parsedData.religiousBeliefs?.trim() || "",
      musicPreferences: parsedData.musicPreferences?.trim() || "",
      moviePreferences: parsedData.moviePreferences?.trim() || "",
      readingInterests: parsedData.readingInterests?.trim() || "",
      travelInterests: parsedData.travelInterests?.trim() || "",
      castPreferences: parsedData.castPreferences?.trim() || "",

      // Genealogy
      gotraDetails: parsedData.gotraDetails?.trim() || "",
      ancestralVillage: parsedData.ancestralVillage?.trim() || "",
      familyHistory: parsedData.familyHistory?.trim() || "",
      communityContributions: parsedData.communityContributions?.trim() || "",
      familyTraditions: parsedData.familyTraditions?.trim() || "",

      // Family Details
      fatherName: parsedData.fatherName?.trim() || "",
      fatherOccupation: parsedData.fatherOccupation?.trim() || "",
      motherName: parsedData.motherName?.trim() || "",
      motherOccupation: parsedData.motherOccupation?.trim() || "",
      brothers: parsedData.brothers?.trim() || "",
      sisters: parsedData.sisters?.trim() || "",
      familyIncome: parsedData.familyIncome?.trim() || "",

      // Education & Career
      highestEducation: parsedData.highestEducation?.trim() || "",
      collegeUniversity: parsedData.collegeUniversity?.trim() || "",
      occupation: parsedData.occupation?.trim() || "",
      companyOrganization: parsedData.companyOrganization?.trim() || "",
      designation: parsedData.designation?.trim() || "",
      workLocation: parsedData.workLocation?.trim() || "",
      annualIncome: parsedData.annualIncome?.trim() || "",
      workExperience: parsedData.workExperience?.trim() || "",

      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/create-profile");

    return {
      success: true,
      message: "Profile created successfully.",
      data: parsedData,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Profile creation error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      timestamp: Date.now(),
    };
  }
}
