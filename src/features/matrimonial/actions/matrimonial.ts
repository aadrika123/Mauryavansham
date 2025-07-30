"use server"

import { db } from "@/src/drizzle/db"
import { matrimonialProfiles } from "@/src/drizzle/schema" // Updated import path
import { revalidatePath } from "next/cache"

export async function createMatrimonialProfile(formData: FormData) {
  const userId = formData.get("userId") as string // Assuming userId is passed or derived from session
  const maritalStatus = formData.get("maritalStatus") as string
  // ... extract other fields

  if (!userId || !maritalStatus) {
    return { success: false, message: "Missing required fields for matrimonial profile." }
  }

  try {
    const [newProfile] = await db
      .insert(matrimonialProfiles)
      .values({
        userId: Number.parseInt(userId),
        maritalStatus: maritalStatus as any, // Cast to enum type
        // ... other fields
      })
      .returning()
    revalidatePath("/matrimonial")
    return { success: true, message: "Matrimonial profile created successfully!", profile: newProfile }
  } catch (error) {
    console.error("Error creating matrimonial profile:", error)
    return { success: false, message: "Failed to create matrimonial profile." }
  }
}

export async function getMatrimonialProfiles() {
  try {
    const profiles = await db.query.matrimonialProfiles.findMany({
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
      },
    })
    return { success: true, profiles }
  } catch (error) {
    console.error("Error fetching matrimonial profiles:", error)
    return { success: false, message: "Failed to fetch matrimonial profiles.", profiles: [] }
  }
}
