"use server"

import { db } from "@/src/drizzle/db"
import { users } from "@/src/drizzle/schema" // Updated import path
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

// Example server action for community features
export async function getCommunityMembers() {
  try {
    const members = await db.query.users.findMany({
      where: eq(users.accountStatus, "active"),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        city: true,
        state: true,
        memberCategory: true,
        profilePhoto: true,
      },
    })
    return { success: true, members }
  } catch (error) {
    console.error("Error fetching community members:", error)
    return { success: false, message: "Failed to fetch community members.", members: [] }
  }
}

export async function postDiscussion(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as string
  // In a real app, you'd insert this into a 'discussions' table
  console.log(`New discussion: ${title} in ${category} - ${content}`)
  revalidatePath("/community") // Revalidate community forum page
  return { success: true, message: "Discussion posted successfully!" }
}
