import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // <-- Import session
import { authOptions } from "@/src/lib/auth"; // <-- your NextAuth config path
import { eq } from "drizzle-orm";
import { db } from "@/src/drizzle/db";
import { achievements } from "@/src/drizzle/schema";

export async function POST(req: Request) {
  try {
    // ✅ Get session details
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const userName = session.user.name || "Unknown User";
    const userId = session.user.id || null;

    // ✅ Get body data
    const { id, status, reason } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (id, status)." },
        { status: 400 }
      );
    }

    // ✅ Prepare update object
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // ✅ Add/remove fields based on status
    if (status === "inactive" || status === "removed") {
      updateData.removedAt = new Date();
      updateData.removedBy = userName;
      updateData.removedById = userId;
      updateData.reason = reason || "No reason provided";
    } else if (status === "active") {
      updateData.removedAt = null;
      updateData.removedBy = null;
      updateData.removedById = null;
      updateData.reason = null;
    }

    // ✅ Update in DB
    const result = await db
      .update(achievements)
      .set(updateData)
      .where(eq(achievements.id, id))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Achievement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Achievement status updated successfully.",
      data: result[0],
    });
  } catch (error: any) {
    console.error("Error updating achievement status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
