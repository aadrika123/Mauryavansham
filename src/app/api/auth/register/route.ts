import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/src/drizzle/db"
import { users } from "@/src/drizzle/schema" // Updated import path
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, dateOfBirth, gender, memberCategory, city, state, bio } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Insert user into database using Drizzle
    const [newUser] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, // Convert to Date object
        gender: gender || null,
        memberCategory: memberCategory || null,
        city: city || null,
        state: state || null,
        bio: bio || null,
        verificationStatus: "pending",
        accountStatus: "inactive",
        role: "member",
        emailVerified: false, // Default to false
        phoneVerified: false,
      })
      .returning() // Use .returning() to get the inserted user

    if (!newUser) {
      throw new Error("Failed to create user in database.")
    }

    // Return success response (excluding password hash)
    const { passwordHash: _, ...userResponse } = newUser

    return NextResponse.json(
      {
        message: "Registration successful. Your account is pending verification.",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
