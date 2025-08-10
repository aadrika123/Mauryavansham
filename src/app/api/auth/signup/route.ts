import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/src/drizzle/db"
import { users } from "@/src/drizzle/db/schemas/users.schema"
import { eq } from "drizzle-orm"
import { sendWelcomeEmail } from "@/src/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      })

    // Send welcome email
    try {
      const emailResult = await sendWelcomeEmail({
        name: newUser[0].name,
        email: newUser[0].email,
        password, // original password in plain text
      })

      console.log('Welcome email send result:', emailResult)
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
