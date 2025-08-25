import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/drizzle/db"
// import { adPlacements } from "@/src/drizzle/schema/adPlacements"
import { asc, eq } from "drizzle-orm"
import { adPlacements } from "@/src/drizzle/schema"

// ✅ Get All Placements
export async function GET() {
  try {
    const placements = await db.select().from(adPlacements).orderBy(asc(adPlacements.id))
    return NextResponse.json(placements)
  } catch (error) {
    console.error("Error fetching placements:", error)
    return NextResponse.json({ error: "Failed to fetch placements" }, { status: 500 })
  }
}

// ✅ Add New Placement
export async function POST(req: NextRequest) {
  try {
    const { id, pageName, sectionName, description } = await req.json()

    if (!id || !pageName || !sectionName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // 🔍 Check if Serial No. (id) already exists
    const existing = await db
      .select()
      .from(adPlacements)
      .where(eq(adPlacements.id, id))

    if (existing.length > 0) {
      return NextResponse.json({ error: `Ads Serial No. ${id} already exists` }, { status: 400 })
    }

    const [newPlacement] = await db
      .insert(adPlacements)
      .values({ id, pageName, sectionName, description })
      .returning()

    return NextResponse.json(newPlacement, { status: 201 })
  } catch (error) {
    console.error("Error adding placement:", error)
    return NextResponse.json({ error: "Failed to add placement" }, { status: 500 })
  }
}

// ✅ Update Placement
export async function PUT(req: NextRequest) {
  try {
    const { id, pageName, sectionName, description } = await req.json()

    if (!id || !pageName || !sectionName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // 🔍 Check if id exists
    const existing = await db
      .select()
      .from(adPlacements)
      .where(eq(adPlacements.id, id))

    if (existing.length === 0) {
      return NextResponse.json({ error: `Ads Serial No. ${id} not found` }, { status: 404 })
    }

    const [updatedPlacement] = await db
      .update(adPlacements)
      .set({ pageName, sectionName, description })
      .where(eq(adPlacements.id, id))
      .returning()

    return NextResponse.json(updatedPlacement)
  } catch (error) {
    console.error("Error updating placement:", error)
    return NextResponse.json({ error: "Failed to update placement" }, { status: 500 })
  }
}
