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
  const role = session.user.role; // 'user' | 'admin' | 'super-admin'

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
      isRead: sql<boolean>`CASE WHEN ${notification_reads.id} IS NULL THEN false ELSE true END`,
    })
    .from(notifications)
    .leftJoin(
      notification_reads,
      sql`${notification_reads.notificationId} = ${notifications.id} 
           AND ${notification_reads.adminId} = ${userId}`
    )
    .leftJoin(users, sql`${notifications.senderId} = ${users.id}`)
    .where(
      role === "user"
        ? sql`${notifications.userId} = ${userId} OR ${notifications.senderId} = ${userId}`
        : undefined // admin/super-admin can see all
    )
    .orderBy(sql`${notifications.createdAt} DESC`);

  // Customize message for sender if type = 'profile_connect'
  const customized = userNotifications.map((n) => {
    if (n.type === "profile_connect") {
      if (n.sender?.id === userId) {
        // ✅ optional chaining
        return {
          ...n,
          // message: `You sent a connection request to ${n.receiverId}`,
        };
      }
    }
    return n;
  });

  return NextResponse.json(customized);
}
