// app/api/discussions/[id]/close/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { discussions } from "@/src/drizzle/db/schemas/discussions";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // ✅ Read payload
    const body = await req.json();
    const reason =
      body.reason || body.rejectionReason || "No reason provided";

    // ✅ Update DB with both fields
    await db
      .update(discussions)
      .set({
        isCompleted: true,
        rejectionReason: reason, // make sure this column exists in schema
      })
      .where(eq(discussions.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: "Discussion closed successfully",
    });
  } catch (err) {
    console.error("Failed to close discussion:", err);
    return NextResponse.json(
      { success: false, message: "Failed to close discussion" },
      { status: 500 }
    );
  }
}
