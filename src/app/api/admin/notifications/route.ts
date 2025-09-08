// /api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { notifications } from "@/src/drizzle/db/schemas/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { sql } from "drizzle-orm";
import { notification_reads } from "@/src/drizzle/db/schemas/notification_reads";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const adminId = Number(session.user.id);

  // Fetch notifications with per-admin read info
  const userNotifications = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      message: notifications.message,
      createdAt: notifications.createdAt,
      isRead: sql<number>`CASE WHEN ${notification_reads.id} IS NULL THEN 0 ELSE 1 END`,
    })
    .from(notifications)
    .leftJoin(notification_reads, sql`${notification_reads.notificationId} = ${notifications.id} AND ${notification_reads.adminId} = ${adminId}`)
    .orderBy(sql`${notifications.createdAt} DESC`);

  return NextResponse.json(userNotifications);
}
