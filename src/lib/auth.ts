import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

// Define a secret for JWT. In production, this should be a strong, random string from environment variables.
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here_replace_in_production"

interface UserSession {
  userId: number
  email: string
  role: string
  exp: number
  iat: number
}

export async function getSession(): Promise<UserSession | null> {
  const sessionToken = cookies().get("session-token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const decoded = verify(sessionToken, JWT_SECRET) as UserSession
    return decoded
  } catch (error) {
    console.error("Failed to verify session token:", error)
    cookies().delete("session-token") // Clear invalid token
    return null
  }
}
