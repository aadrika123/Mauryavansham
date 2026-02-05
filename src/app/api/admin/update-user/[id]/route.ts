// /api/admin/update-user/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq } from 'drizzle-orm';
import { users } from '@/src/drizzle/schema';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    const body = await req.json();

    const updates: Record<string, any> = {};

    if (typeof body.role !== 'undefined') {
      updates.role = body.role;
    }

    if (typeof body.isActive !== 'undefined') {
      updates.isActive = body.isActive;

      if (body.isActive === false) {
        updates.deactivatedReason =
          typeof body.deactivationReason !== 'undefined'
            ? body.deactivationReason
            : null;
      } else {
        updates.deactivatedReason = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    await db.update(users).set(updates).where(eq(users.id, userId));
    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
