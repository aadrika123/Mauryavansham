import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { enquiries } from '@/src/drizzle/schema';
import { eq, or, asc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

// 🔹 GET: fetch all enquiries/messages for the current user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = String(session.user.id);

  // Fetch all enquiries where user is sender or receiver
  const rows = await db
    .select()
    .from(enquiries)
    .where(or(eq(enquiries.senderUserId, userId), eq(enquiries.receiverUserId, userId)))
    .orderBy(asc(enquiries.createdAt));

  // Map to unique conversation partners with all enquiryTypes and latest message
  const conversationMap = new Map<string | null, any>();

  rows.forEach(msg => {
    const senderId = msg.senderUserId;
    const receiverId = msg.receiverUserId;

    // Determine "other user" in this message
    const otherUserId = senderId == userId ? receiverId : senderId;

    const existing = conversationMap.get(otherUserId ?? '');

    if (!existing) {
      // First message with this user
      conversationMap.set(otherUserId ?? '', {
        userId: otherUserId,
        messages: [
          {
            id: msg.id,
            senderUserId: senderId,
            receiverUserId: receiverId,
            comment: msg.comment,
            enquireType: msg.enquireType,
            createdAt: msg.createdAt
          }
        ],
        latestMessage: msg.comment,
        latestCreatedAt: msg.createdAt,
        enquiryTypes: [msg.enquireType]
      });
    } else {
      // Add message
      existing.messages.push({
        id: msg.id,
        senderUserId: senderId,
        receiverUserId: receiverId,
        comment: msg.comment,
        enquireType: msg.enquireType,
        createdAt: msg.createdAt
      });

      // Add unique enquiryType
      if (!existing.enquiryTypes.includes(msg.enquireType)) {
        existing.enquiryTypes.push(msg.enquireType);
      }

      // Update latest message if newer
      const msgCreatedAt = msg.createdAt ?? new Date(0);
      const existingCreatedAt = existing.latestCreatedAt ?? new Date(0);
      if (new Date(msgCreatedAt).getTime() > new Date(existingCreatedAt).getTime()) {
        existing.latestMessage = msg.comment;
        existing.latestCreatedAt = msg.createdAt;
      }

      conversationMap.set(otherUserId ?? '', existing);
    }
  });

  // Return array of unique conversation partners sorted by latest message
  const uniqueConversations = Array.from(conversationMap.values()).sort(
    (a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime()
  );

  return NextResponse.json(uniqueConversations);
}

// 🔹 POST: send a new enquiry/message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { comment, enquireType, receiverUserId } = body;
  const senderUserId = String(session.user.id);

  if (!receiverUserId || !comment || !enquireType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (senderUserId == receiverUserId) {
    return NextResponse.json({ error: 'You cannot send an enquiry to yourself.' }, { status: 400 });
  }

  // Check if same enquiryType already exists between sender and receiver
  const existing = await db
    .select()
    .from(enquiries)
    .where(
      and(
        eq(enquiries.senderUserId, senderUserId),
        eq(enquiries.receiverUserId, String(receiverUserId)),
        eq(enquiries.enquireType, enquireType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      {
        error: `You have already sent a "${enquireType}" enquiry to this user. Check your enquiries tab for response.`
      },
      { status: 400 }
    );
  }

  // Insert new enquiry
  const [enquiry] = await db
    .insert(enquiries)
    .values({
      senderUserId,
      receiverUserId: String(receiverUserId),
      comment,
      enquireType,
      createdAt: new Date()
    })
    .returning();

  return NextResponse.json({ success: true, data: enquiry });
}
