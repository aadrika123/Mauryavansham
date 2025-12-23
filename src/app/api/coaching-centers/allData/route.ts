import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { eq } from "drizzle-orm";
import { coachingCenters } from "@/src/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    const centers = await db
      .select()
      .from(coachingCenters)

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
