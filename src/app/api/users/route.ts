import { NextResponse } from "next/server"
import { db } from "@/src/drizzle/db"

export async function GET() {
  try {
    const allUsers = await db.query.users.findMany()
    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
