import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const activeUsers = await db
      .select({
        id: users.id,
        name: users.name,
        photo: users.photo,
        city: users.city,
        occupation: users.occupation,
        userCode: users.userCode,
        designation: users.designation,
        professionGroup: users.professionGroup,
        profession: users.profession,
        gender: users.gender,
        fatherName: users.fatherName,
        motherName: users.motherName,
        dob: users.dateOfBirth,
        maritalStatus: users.maritalStatus,
        education: users.education,
        spouseName: users.spouseName,
      })
      .from(users)
      .where(
        and(
          eq(users.isActive, true),
          eq(users.status, "approved")   // ✅ status check add kiya
        )
      );

    return NextResponse.json(activeUsers);
  } catch (error) {
    console.error("Error fetching active users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
