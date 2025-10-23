
import { db } from "@/src/drizzle/db";
import { coachingCenters } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// ==============================
// GET Coaching Center by ID
// ==============================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const centerId = Number(params.id);

    const center = await db
      .select()
      .from(coachingCenters)
      .where(eq(coachingCenters.id, centerId));

    if (center.length === 0) {
      return NextResponse.json({ success: false, error: "Not found" });
    }

    return NextResponse.json({ success: true, data: center[0] });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// ==============================
// PUT Update Coaching Center by ID
// ==============================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const centerId = Number(params.id);
    const body = await req.json();

    await db
      .update(coachingCenters)
      .set({
        centerName: body.centerName,
        ownerName: body.ownerName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        courses: body.courses, // assuming JSON type
        branches: body.branches, // assuming JSON type
        about: body.about,
        logoUrl: body.logoUrl,
        docUrls: body.docUrls,
      })
      .where(eq(coachingCenters.id, centerId));

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}
