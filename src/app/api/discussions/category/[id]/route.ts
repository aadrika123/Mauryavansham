import { db } from "@/src/drizzle/db";
import { discussionCategories } from "@/src/drizzle/db/schemas/discussionCategories";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = Number(params.id);
    if (!categoryId) {
      return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, status } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
    }

    const [updatedCategory] = await db
      .update(discussionCategories)
      .set({ name: name.trim(), status: status || "active" })
      .where(eq(discussionCategories.id, categoryId))
      .returning();

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ success: false, message: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = Number(params.id);
    if (!categoryId) {
      return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    }

    await db.delete(discussionCategories).where(eq(discussionCategories.id, categoryId));

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, message: "Failed to delete category" }, { status: 500 });
  }
}
