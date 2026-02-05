import { db } from '@/src/drizzle/db';
import { businesses } from '@/src/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const business = await db.query.businesses.findFirst({
      where: and(
        eq(businesses.id, Number(id)),
        eq(businesses.userId, Number(session.user.id)) // ✅ ensure user apna hi business dekh sake
      )
    });

    if (!business) {
      return Response.json(
        { success: false, message: 'Business not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: business });
  } catch (error) {
    console.error('GET /api/businesses/[id] Error:', error);
    return Response.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const businessId = Number(id);
    const body = await req.json();

    const dataToUpdate = {
      ...body,
      updatedAt: new Date()
    };

    const updated = await db
      .update(businesses)
      .set(dataToUpdate)
      .where(
        and(
          eq(businesses.id, businessId),
          eq(businesses.userId, Number(session.user.id)) // ✅ sirf apna hi update
        )
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { success: false, message: 'Business not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('PATCH /api/businesses/[id] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
