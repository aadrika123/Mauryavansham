"use server";

import { db } from "@/src/drizzle/db";
import { profiles } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

// Public Profile List (basic info + review)
export async function getPublicProfiles() {
  try {
    const data = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        profileRelation: profiles.profileRelation,
        nickName: profiles.nickName,
        gender: profiles.gender,
        dob: profiles.dob,
        height: profiles.height,
        weight: profiles.weight,
        complexion: profiles.complexion,
        maritalStatus: profiles.maritalStatus,
        highestEducation: profiles.highestEducation,
        occupation: profiles.occupation,
        companyOrganization: profiles.companyOrganization,
        workLocation: profiles.workLocation,
        profileImage: profiles.profileImage,
        profileImage1: profiles.profileImage1,
        profileImage2: profiles.profileImage2,
        profileImage3: profiles.profileImage3,
        isPremium: profiles.isPremium,
        isVerified: profiles.isVerified,
        isActive: profiles.isActive,
        deactivateReview: profiles.deactivateReview, // review text
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      })
      .from(profiles)
      .where(eq(profiles.isActive, true)); // ✅ only active profiles for public

    return { success: true, profiles: data };
  } catch (error) {
    console.error("Error fetching public profiles:", error);
    return { success: false, profiles: [] };
  }
}

// Get Single Public Profile by ID
export async function getProfileByIdPublic(id: number) {
  try {
    const data = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        profileRelation: profiles.profileRelation,
        nickName: profiles.nickName,
        gender: profiles.gender,
        dob: profiles.dob,
        height: profiles.height,
        complexion: profiles.complexion,
        maritalStatus: profiles.maritalStatus,
        highestEducation: profiles.highestEducation,
        occupation: profiles.occupation,
        companyOrganization: profiles.companyOrganization,
        workLocation: profiles.workLocation,
        profileImage: profiles.profileImage,
        profileImage1: profiles.profileImage1,
        profileImage2: profiles.profileImage2,
        profileImage3: profiles.profileImage3,
        isPremium: profiles.isPremium,
        isVerified: profiles.isVerified,
        deactivateReview: profiles.deactivateReview,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(eq(profiles.id, id));

    if (!data.length) return { success: false, profile: null };

    return { success: true, profile: data[0] };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return { success: false, profile: null };
  }
}
