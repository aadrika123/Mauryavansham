import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "@/src/drizzle/schema"; // make sure this path is correct

// Route handler for GET /api/users/[profileId]
export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profileId = params.profileId;
    console.log(profileId, "profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    // Compare as string, do not convert to Number
    const user = await db.query.users.findFirst({
      where: eq(users.profileId, profileId),
    });
    console.log("User from DB:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user by profileId:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
