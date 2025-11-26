import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { notification_reads } from "@/src/drizzle/db/schemas/notification_reads";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const adminId = Number(session.user.id);

  // Check if entry exists
  const existing = await db
    .select()
    .from(notification_reads)
    .where(eq(notification_reads.adminId, adminId));

  if (existing.length === 0) {
    // INSERT new row
    await db.insert(notification_reads).values({
      adminId,
      markAllRead: true,
    });
  } else {
    // UPDATE existing
    await db
      .update(notification_reads)
      .set({ markAllRead: true })
      .where(eq(notification_reads.adminId, adminId));
  }

  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
  });
}
