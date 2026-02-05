import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { notifications } from '@/src/drizzle/db/schemas/notifications';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { sql, eq } from 'drizzle-orm';
import { notification_reads } from '@/src/drizzle/db/schemas/notification_reads';
import { users } from '@/src/drizzle/schema';

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
        email: users.email
      },

      isRead: sql<boolean>`
  CASE
    -- Individual read
    WHEN EXISTS (
      SELECT 1 
      FROM notification_reads nr
      WHERE nr.notification_id = ${notifications.id}
        AND nr.admin_id = ${userId}
        AND nr.mark_all_read = false
    ) THEN false

    -- Admin mark-all-read -> but only for old notifications
    WHEN ${role} = 'admin' AND EXISTS (
      SELECT 1 
      FROM notification_reads nr
      WHERE nr.admin_id = ${userId}
        AND nr.mark_all_read = true
        AND nr.created_at <= ${notifications.createdAt}
    ) THEN true

    ELSE false
  END
`
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.senderId, users.id))
    .where(role === 'user' ? sql`${notifications.type} != 'signup' AND ${notifications.userId} = ${userId}` : undefined)
    .orderBy(sql`${notifications.createdAt} DESC`);

  return NextResponse.json(userNotifications);
}
