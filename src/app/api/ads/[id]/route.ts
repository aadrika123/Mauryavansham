import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/drizzle/db';
import { ads } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ convert params.id to number
    const adId = Number(id);
    if (isNaN(adId)) {
      return NextResponse.json({ error: 'Invalid ad id' }, { status: 400 });
    }

    const [ad] = await db.select().from(ads).where(eq(ads.id, adId));

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // ✅ session.user.id is string, so convert before comparing
    if (ad.userId !== Number(session.user.id) && session.user.role !== 'admin' && session.user.role !== 'superAdmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ad });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    const adId = Number(id);
    if (isNaN(adId)) {
      return NextResponse.json({ error: 'Invalid ad id' }, { status: 400 });
    }

    const [existingAd] = await db.select().from(ads).where(eq(ads.id, adId));
    if (!existingAd) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (session.user.role !== 'admin' && session.user.role !== 'superAdmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const [updatedAd] = await db
      .update(ads)
      .set({
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
        rejectedBy: status === 'rejected' ? session.user.name : null, // ✅ add rejectedBy
        approvedAt: status === 'approved' ? new Date() : null,
        approvedBy: status === 'approved' ? session.user.name : null, // ✅ add approvedBy
        updatedAt: new Date()
      })
      .where(eq(ads.id, adId))
      .returning();

    return NextResponse.json({ ad: updatedAd });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
