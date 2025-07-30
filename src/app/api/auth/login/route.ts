import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/src/drizzle/db"
import { users } from "@/src/drizzle/schema" // Updated import path
import { eq } from "drizzle-orm"
import { sign } from "jsonwebtoken" // For creating a session token

// Define a secret for JWT. In production, this should be a strong, random string from environment variables.
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here_replace_in_production"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Query database for user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check account status
    if (user.accountStatus !== "active") {
      return NextResponse.json({ error: "Account is not active. Please contact support." }, { status: 403 })
    }

    // Create a session token (JWT)
    const sessionToken = sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    })

    // Update last login timestamp
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id))

    // Return success response and set session cookie
    const { passwordHash: _, ...userResponse } = user // Exclude password hash from response

    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
    })

    response.cookies.set("session-token", sessionToken, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax", // Protect against CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Available across the entire site
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
