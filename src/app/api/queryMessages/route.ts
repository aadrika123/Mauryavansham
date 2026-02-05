// src/app/api/queryMessages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq, or, and, asc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { queryMessages } from '@/src/drizzle/schema';

// ✅ GET: Fetch conversation between logged-in user and another user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = String(session.user.id);
  const otherUserId = String(searchParams.get('userId'));
  const queryType = searchParams.get('queryType'); // optional

  if (!otherUserId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const conditions = [
    or(
      and(eq(queryMessages.senderId, userId), eq(queryMessages.receiverId, otherUserId)),
      and(eq(queryMessages.senderId, otherUserId), eq(queryMessages.receiverId, userId))
    )
  ];

  if (queryType) {
    conditions.push(eq(queryMessages.queryType, queryType));
  }

  const conversation = await db
    .select()
    .from(queryMessages)
    .where(and(...conditions))
    .orderBy(asc(queryMessages.createdAt));

  return NextResponse.json(conversation);
}

// ✅ POST: Send a new message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { receiverId, text, queryType } = await req.json();
  if (!receiverId || !text) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const [msg] = await db
    .insert(queryMessages)
    .values({
      senderId: String(session.user.id),
      receiverId: String(receiverId),
      text,
      queryType: queryType || 'general'
    })
    .returning();

  return NextResponse.json(msg);
}
