import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
// import { password_reset_otps } from "@/src/drizzle/db/schemas/otp.schema";
import { eq, and, gt } from "drizzle-orm";
import { password_reset_otps } from "@/src/drizzle/db/schemas/password_reset_otps";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Find matching OTP that is still valid
    const record = await db.query.password_reset_otps.findFirst({
      where: and(
        eq(password_reset_otps.email, email),
        eq(password_reset_otps.otp, otp),
        gt(password_reset_otps.expires_at, new Date())
      ),
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Optionally delete OTP record here after successful verification

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
