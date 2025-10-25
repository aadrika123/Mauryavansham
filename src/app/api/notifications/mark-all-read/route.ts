import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { notifications } from "@/src/drizzle/db/schemas/notifications"; // agar aapke paas ye table hai
import { notification_reads } from "@/src/drizzle/db/schemas/notification_reads";
import { eq, notInArray, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const adminId = Number(session.user.id);

  // ✅ Insert one record for "mark all read" without caring about individual notification IDs
  await db
  .update(notification_reads)
  .set({ markAllRead: true })
  .where(eq(notification_reads.adminId, adminId));

  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
  });
}

