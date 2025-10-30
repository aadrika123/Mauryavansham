import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { achievements } from "@/src/drizzle/db/schemas/achievements";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

// 🟡 UPDATE ACHIEVEMENT (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const id = Number(params.id);
    const body = await req.json();

    await db
      .update(achievements)
      .set({
        name: body.name,
        title: body.title,
        description: body.description,
        image: body.image,
        category: body.category,
        year: body.year,
        location: body.location,
        keyAchievement: body.keyAchievement,
        impact: body.impact,
        achievements: body.achievements ?? [],
        isVerified: body.isVerified ?? false,
        isFeatured: body.isFeatured ?? false,
        isHallOfFame: body.isHallOfFame ?? false,
        updatedBy: user.name || "Unknown",
        updatedById: user.id,
        updatedAt: new Date(),
      })
      .where(eq(achievements.id, id));

    return NextResponse.json(
      { success: true, message: "Achievement updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating achievement:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update achievement" },
      { status: 500 }
    );
  }
}

// 🔵 GET SINGLE ACHIEVEMENT (optional)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, id));

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (err) {
    console.error("❌ Error fetching achievement:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch achievement" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE (optional)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    await db
      .update(achievements)
      .set({ status: "removed" })
      .where(eq(achievements.id, id));

    return NextResponse.json(
      { success: true, message: "Achievement removed" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error deleting achievement:", err);
    return NextResponse.json(
      { success: false, message: "Failed to remove achievement" },
      { status: 500 }
    );
  }
}
