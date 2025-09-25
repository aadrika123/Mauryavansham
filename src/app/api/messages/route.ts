import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { messages } from "@/src/drizzle/db/schemas/messages";
import { eq, or, and, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = Number(session.user.id);
  const otherUserId = Number(searchParams.get("userId"));

  if (!otherUserId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Fetch conversation (messages between logged-in user and other user)
  const rows = await db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
        and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
      )
    )
    .orderBy(asc(messages.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiverId, text } = await req.json();
  if (!receiverId || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [msg] = await db
    .insert(messages)
    .values({
      senderId: Number(session.user.id),
      receiverId: Number(receiverId),
      text,
    })
    .returning();

  return NextResponse.json(msg);
}
