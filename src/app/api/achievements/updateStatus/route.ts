import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { eq } from 'drizzle-orm';
import { db } from '@/src/drizzle/db';
import { achievements } from '@/src/drizzle/db/schemas/achievements';

export async function POST(req: Request) {
  try {
    // ✅ Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
    }

    const userName = session.user.name || 'Unknown User';
    const userId = session.user.id;

    // ✅ Parse body
    const { id, status, reason } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing required fields (id, status).' }, { status: 400 });
    }

    // ✅ Build update data object
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date(),
      updatedBy: userName,
      updatedById: userId
    };

    // ✅ Handle status-specific logic
    if (status === 'inactive' || status === 'removed') {
      updateData.removedAt = new Date();
      updateData.removedBy = userName;
      updateData.removedById = userId;
      updateData.reason = reason || 'No reason provided';
    } else if (status === 'active') {
      updateData.removedAt = null;
      updateData.removedBy = null;
      updateData.removedById = null;
      updateData.reason = null;
    }

    // ✅ Update in DB
    const result = await db.update(achievements).set(updateData).where(eq(achievements.id, id)).returning();

    if (!result?.length) {
      return NextResponse.json({ success: false, message: 'Achievement not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Achievement status updated successfully.',
      data: result[0]
    });
  } catch (error: any) {
    console.error('❌ Error updating achievement status:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error.' }, { status: 500 });
  }
}
