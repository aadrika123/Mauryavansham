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

      sender: {
        id: users.id,
        name: users.name,
        photo: users.photo,
        email: users.email,
      },
      receiverId: notifications.userId,
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
        ? sql`${notifications.type} != 'signup' 
          AND ${notifications.userId} = ${userId}`
        : undefined
    )

    .orderBy(sql`${notifications.createdAt} DESC`);

  // Customize message if sender exists
  const customized = userNotifications.map((n) => {
    if (n.type === "profile_connect" && n.sender?.id === userId) {
      return {
        ...n,
        message: `You sent a connection request to user ${n.receiverId}`,
      };
    }
    return n;
  });

  return NextResponse.json(customized);
}

// 📌 POST: insert new notification
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id ? Number(session.user.id) : null;

  const body = await req.json();

  const userId =
    body.userId || body.businessOwnerId || body.profileId || body.customerId;

  if (!userId || !body.type || !body.message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Check if a similar connection request already exists
  const existing = await db
    .select()
    .from(notifications)
    .where(
      sql`${notifications.type} = 'profile_connect' 
        AND ${notifications.senderId} = ${senderId}
        AND ${notifications.userId} = ${userId}`
    );

  if (existing.length > 0) {
    return NextResponse.json(
      {
        message:
          "You are already connected with this user. You can go to your inbox to chat with them.",
      },
      { status: 409 } // Conflict
    );
  }

  // ✅ If not connected, create a new notification
  const [notification] = await db
    .insert(notifications)
    .values({
      type: body.type,
      message: body.message,
      userId: userId, // receiver
      senderId: senderId, // sender (nullable)
    })
    .returning();

  return NextResponse.json(notification);
}
