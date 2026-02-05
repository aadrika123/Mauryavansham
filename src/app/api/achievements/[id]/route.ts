import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { achievements } from '@/src/drizzle/db/schemas/achievements';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

// 🟡 UPDATE ACHIEVEMENT (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const id = Number(paramId);
    const body = await req.json();

    await db
      .update(achievements)
      .set({
        name: body.name,
        fatherName: body.fatherName,
        motherName: body.motherName,
        achievementTitle: body.achievementTitle,
        description: body.description,
        images: body.images, // array of URLs (1 mandatory, 2 optional)
        category: body.category,
        otherCategory: body.otherCategory || null,
        year: body.year,
        location: body.location,
        keyAchievement: body.keyAchievement,
        impact: body.impact,
        achievements: body.achievements ?? [],
        isVerified: body.isVerified ?? false,
        isFeatured: body.isFeatured ?? false,
        isHallOfFame: body.isHallOfFame ?? false,
        updatedBy: user.name || 'Unknown',
        updatedById: user.id,
        updatedAt: new Date()
      })
      .where(eq(achievements.id, id));

    return NextResponse.json({ success: true, message: 'Achievement updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Error updating achievement:', err);
    return NextResponse.json({ success: false, message: 'Failed to update achievement' }, { status: 500 });
  }
}

// 🔵 GET SINGLE ACHIEVEMENT
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);

    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));

    if (!achievement) {
      return NextResponse.json({ success: false, message: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (err) {
    console.error('❌ Error fetching achievement:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch achievement' }, { status: 500 });
  }
}

// 🔴 DELETE (soft delete)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const id = Number(paramId);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    await db
      .update(achievements)
      .set({
        status: 'removed',
        removedBy: user.name || 'Unknown',
        removedById: user.id,
        removedAt: new Date()
      })
      .where(eq(achievements.id, id));

    return NextResponse.json({ success: true, message: 'Achievement removed successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Error deleting achievement:', err);
    return NextResponse.json({ success: false, message: 'Failed to remove achievement' }, { status: 500 });
  }
}
