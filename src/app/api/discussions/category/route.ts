import { db } from "@/src/drizzle/db";
import { discussionCategories } from "@/src/drizzle/db/schemas/discussionCategories";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(discussionCategories)
      .where(eq(discussionCategories.status, "active")); // only active categories

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(discussionCategories)
      .where(eq(discussionCategories.name, name.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }

    const [newCategory] = await db
      .insert(discussionCategories)
      .values({
        name: name.trim(),
        status: "active",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
