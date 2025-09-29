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
        userCode: users.userCode,
        aboutMe: users.aboutMe,
        role: users.role,
        isApproved: users.isApproved,
        gender: users.gender,
        dateOfBirth: users.dateOfBirth,
        photo: users.photo,
        maritalStatus: users.maritalStatus,
        motherTongue: users.motherTongue,
        height: users.height,
        weight: users.weight,
        bloodGroup: users.bloodGroup,
        education: users.education,
        occupation: users.occupation,
        jobType: users.jobType,
        govSector: users.govSector,
        department: users.department,
        postingLocation: users.postingLocation,
        designation: users.designation,
        company: users.company,
        businessDetails: users.businessDetails,
        professionGroup: users.professionGroup,
        profession: users.profession,
        professionDetails: users.professionDetails,
        fatherName: users.fatherName,
        motherName: users.motherName,
        spouseName: users.spouseName,
        facebookLink: users.facebookLink,
        profileCompletion: users.profileCompletion,
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
