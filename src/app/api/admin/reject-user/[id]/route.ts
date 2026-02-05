import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq, and } from 'drizzle-orm';
import { users, userApprovals } from '@/src/drizzle/schema';

const REQUIRED_APPROVALS = 3;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    const { adminId, adminName, reason } = await req.json();

    // 1️⃣ Check if this admin already acted
    const existing = await db.query.userApprovals.findFirst({
      where: and(
        eq(userApprovals.userId, userId),
        eq(userApprovals.adminId, adminId)
      )
    });

    if (existing) {
      // update decision to rejected
      await db
        .update(userApprovals)
        .set({ status: 'rejected', reason })
        .where(eq(userApprovals.id, existing.id));
    } else {
      // insert new rejection
      await db.insert(userApprovals).values({
        userId,
        adminId,
        adminName,
        status: 'rejected',
        reason
      });
    }

    // 2️⃣ Recalculate status
    const approvals = await db.query.userApprovals.findMany({
      where: eq(userApprovals.userId, userId)
    });

    const approvedCount = approvals.filter(
      (a) => a.status === 'approved'
    ).length;
    const rejectedCount = approvals.filter(
      (a) => a.status === 'rejected'
    ).length;

    let newStatus: 'pending' | 'approved' | 'rejected' = 'pending';
    let isApproved = false;

    if (rejectedCount > 0) {
      newStatus = 'rejected';
      isApproved = false;
    } else if (approvedCount >= REQUIRED_APPROVALS) {
      newStatus = 'approved';
      isApproved = true;
    }

    await db
      .update(users)
      .set({ status: newStatus, isApproved })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: 'User rejected with reason'
    });
  } catch (error) {
    console.error('Reject error:', error);
    return NextResponse.json(
      { error: 'Failed to reject user' },
      { status: 500 }
    );
  }
}
