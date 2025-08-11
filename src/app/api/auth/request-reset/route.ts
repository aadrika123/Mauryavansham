import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/db/schemas/users.schema";
import { eq } from "drizzle-orm";
import { sendForgotPasswordEmail } from "@/src/lib/email";  // separate fn for forgot password email
import { password_reset_otps } from "@/src/drizzle/db/schemas/password_reset_otps";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(password_reset_otps).values({
      email,
      otp,
      expires_at: expiresAt,
    });

    // Send OTP email using dedicated function
    await sendForgotPasswordEmail({
      name: user.name,
      email,
      otp,  // send OTP explicitly
    });

    return NextResponse.json({ message: "OTP sent to email" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
