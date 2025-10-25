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

  // ✅ Get all notification IDs (assuming you have notifications table)
  const allNotifications = await db
    .select({ id: notifications.id })
    .from(notifications);

  if (!allNotifications || allNotifications.length === 0) {
    return NextResponse.json({ message: "No notifications found" }, { status: 404 });
  }

  const allIds = allNotifications.map((n) => n.id);

  // ✅ Get already read ones for this admin
  const alreadyRead = await db
    .select({ notificationId: notification_reads.notificationId })
    .from(notification_reads)
    .where(eq(notification_reads.adminId, adminId));

  const readIds = alreadyRead.map((r) => r.notificationId);

  // ✅ Filter unread notifications only
  const unreadIds = allIds.filter((id) => !readIds.includes(id));

  if (unreadIds.length === 0) {
    return NextResponse.json({ message: "No unread notifications" });
  }

  // ✅ Insert remaining unread as read
  await db.insert(notification_reads).values(
    unreadIds.map((id) => ({
      notificationId: id,
      adminId,
    }))
  );

  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
    count: unreadIds.length,
  });
}
