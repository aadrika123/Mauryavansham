import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { eq } from "drizzle-orm";
import { coachingCenters } from "@/src/drizzle/schema";



export async function GET(request: NextRequest) {
  try {
    // userId query param se milega (frontend se ?userId=123)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in query parameters." },
        { status: 400 }
      );
    }

    const centers = await db
      .select()
      .from(coachingCenters)
      .where(eq(coachingCenters.userId, userId));

    return NextResponse.json({
      success: true,
      data: centers,
    });
  } catch (error) {
    console.error("Error fetching coaching centers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      centerName,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      courses,
      branches,
    //   imageUrl,
      logoUrl,
      docUrls,
      userId,
      about
    } = data;

    // Optional validation
    if (!centerName || !ownerName || !email) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    await db
      .insert(coachingCenters)
      .values({
        centerName,
        ownerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        courses,
        branches,
        logoUrl,
        docUrls,
        userId,
        about,
        status: "active", // 👈 default value
        approvedBy: null,
        rejectedBy: null,
        rejectedReason: null,
      })

      .returning();

    return NextResponse.json({
      success: true,
      message: "Coaching center registered successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Error saving coaching center:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
