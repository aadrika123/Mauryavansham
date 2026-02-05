import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { notification_reads } from '@/src/drizzle/db/schemas/notification_reads';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const adminId = Number(session.user.id);
  const body = await req.json();
  const { notificationIds } = body;

  if (!notificationIds || notificationIds.length === 0) {
    return NextResponse.json({ message: 'Notification ids required' }, { status: 400 });
  }

  await db
    .insert(notification_reads)
    .values(
      notificationIds.map((id: number) => ({
        notificationId: id,
        adminId
      }))
    )
    .onConflictDoNothing(); // 🚀 Prevent duplicates

  return NextResponse.json({ success: true });
}
