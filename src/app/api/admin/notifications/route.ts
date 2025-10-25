import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { notifications } from "@/src/drizzle/db/schemas/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { sql } from "drizzle-orm";
import { notification_reads } from "@/src/drizzle/db/schemas/notification_reads";
import { users } from "@/src/drizzle/schema";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json([], { status: 401 });
  }

  const userId = Number(session.user.id);
  const role = session.user.role;

  const userNotifications = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      message: notifications.message,
      createdAt: notifications.createdAt,
      receiverId: notifications.userId,
      sender: {
        id: users.id,
        name: users.name,
        photo: users.photo,
        email: users.email,
      },
      // ✅ Check individual read or mark all read
      isRead: sql<boolean>`
        CASE 
          WHEN ${notification_reads.id} IS NOT NULL THEN true
          WHEN EXISTS (
            SELECT 1 
            FROM notification_reads nr
            WHERE nr.admin_id = ${userId} AND nr.mark_all_read = true
          ) THEN true
          ELSE false
        END
      `,
    })
    .from(notifications)
    .leftJoin(
      notification_reads,
      sql`${notification_reads.notificationId} = ${notifications.id} 
           AND ${notification_reads.adminId} = ${userId}`
    )
    .leftJoin(users, sql`${notifications.senderId} = ${users.id}`)
    // ✅ Only filter by user role and type, no need for markAllRead in WHERE
    .where(
      role === "user"
        ? sql`${notifications.type} != 'signup' AND ${notifications.userId} = ${userId}`
        : undefined
    )
    .orderBy(sql`${notifications.createdAt} DESC`);

  return NextResponse.json(userNotifications);
}
