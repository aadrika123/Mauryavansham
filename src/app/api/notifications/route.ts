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
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json([], { status: 401 });
  }

  const userId = Number(session.user.id);
  const role = session.user.role; // 'user' | 'admin' | 'super-admin'

  const userNotifications = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      message: notifications.message,
      createdAt: notifications.createdAt,
      isRead: sql<boolean>`CASE WHEN ${notification_reads.id} IS NULL THEN false ELSE true END`,
    })
    .from(notifications)
    .leftJoin(
      notification_reads,
      sql`${notification_reads.notificationId} = ${notifications.id} AND ${notification_reads.adminId} = ${userId}`
    )
    .where(
      role === "user"
        ? sql`${notifications.type} != 'signup'` // exclude signup notifications for normal users
        : undefined
    )
    .orderBy(sql`${notifications.createdAt} DESC`);

  return NextResponse.json(userNotifications);
}


export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.businessOwnerId || !body.type || !body.message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Insert notification
  const [notification] = await db
    .insert(notifications)
    .values({
      type: body.type, // frontend se aaya hua type
      message: body.message, // frontend se aaya hua message
      userId: body.businessOwnerId, // notification kis ko jayega
    })
    .returning(); // returning() ka use kar ke naya insert hua row mil jaayega

  return NextResponse.json(notification);
}
