import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq } from 'drizzle-orm';
import { discussions } from '@/src/drizzle/db/schemas/discussions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

// ✅ Get single discussion
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.discussions.findFirst({
      where: eq(discussions.id, parseInt(id))
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Discussion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, discussion: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch discussion' },
      { status: 500 }
    );
  }
}

// ✅ Update (Approve/Reject/Edit)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const moderatorId = session.user.id; // 👈 ab yahi use hoga
    const moderatorName = session.user.name || 'Moderator'; // 👈 ab yahi use hoga

    const updateData: any = {
      title: body.title,
      content: body.content,
      category: body.category,
      status: body.status,
      updatedAt: new Date(),
      location: body.location,
      rejectionReason: body.rejectedReason,
      moderatorId, // 👈 session se aaya
      moderatorName
    };

    if (body.status === 'approved') {
      updateData.approvedBy = moderatorName;
      updateData.approvedById = moderatorId;
      updateData.approvedAt = new Date();
    }

    if (body.status === 'rejected') {
      updateData.rejectedBy = moderatorName;
      updateData.rejectedById = moderatorId;
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = body.rejectedReason;
    }

    await db
      .update(discussions)
      .set(updateData)
      .where(eq(discussions.id, parseInt(id)));

    const [updatedDiscussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: `Discussion ${body.status || 'updated'} successfully`,
      data: updatedDiscussion
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to update discussion' },
      { status: 500 }
    );
  }
}

// ✅ Delete discussion
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(discussions).where(eq(discussions.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete discussion' },
      { status: 500 }
    );
  }
}
