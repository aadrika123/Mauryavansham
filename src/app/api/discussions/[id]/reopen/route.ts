// app/api/discussions/[id]/reopen/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { discussions } from '@/src/drizzle/db/schemas/discussions';
import { eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await db
      .update(discussions)
      .set({
        isCompleted: false,
        // Optional: if you’re also saving closeReason field
        rejectionReason: null
      })
      .where(eq(discussions.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: 'Discussion reopened successfully'
    });
  } catch (err) {
    console.error('Failed to reopen discussion:', err);
    return NextResponse.json({ success: false, message: 'Failed to reopen discussion' }, { status: 500 });
  }
}
