// app/api/discussions/[id]/close/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { discussions } from "@/src/drizzle/db/schemas/discussions";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await db
      .update(discussions)
      .set({ isCompleted: true })
      .where(eq(discussions.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to close discussion" }, { status: 500 });
  }
}
