import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { achievements } from '@/src/drizzle/db/schemas/achievements';
import { db } from '@/src/drizzle/db';
import { ne, desc } from 'drizzle-orm';

// 🟢 CREATE ACHIEVEMENT (POST)
export async function POST(req: Request) {
  try {
    // ✅ Get user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    // ✅ Parse JSON body
    const body = await req.json();

    const images = Array.isArray(body.images)
      ? body.images.filter(Boolean)
      : [body.image1, body.image2, body.image3].filter(Boolean);

    // ✅ Validation
    if (
      !body.name ||
      !body.fatherName ||
      !body.motherName ||
      !body.achievementTitle ||
      !body.description ||
      images.length === 0 || // check if at least one image exists
      !body.category ||
      !body.year ||
      !body.location ||
      !body.keyAchievement ||
      !body.impact
    ) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // ✅ Insert into DB
    const [newAchievement] = await db
      .insert(achievements)
      .values({
        name: body.name,
        fatherName: body.fatherName,
        motherName: body.motherName,
        achievementTitle: body.achievementTitle,
        description: body.description,
        images, // use combined array
        category: body.category,
        otherCategory: body.customCategory || null,
        isVerified: body.isVerified ?? false,
        isFeatured: body.isFeatured ?? false,
        isHallOfFame: body.isHallOfFame ?? false,
        year: Number(body.year),
        location: body.location,
        keyAchievement: body.keyAchievement,
        impact: body.impact,
        achievements: body.achievements ?? [],
        status: 'active',
        createdBy: user.name || 'Unknown',
        createdById: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json({ success: true, data: newAchievement }, { status: 201 });
  } catch (err) {
    console.error('❌ Error creating achievement:', err);
    return NextResponse.json({ success: false, message: 'Failed to create achievement' }, { status: 500 });
  }
}

// 🟡 FETCH ALL ACHIEVEMENTS (GET)
export async function GET() {
  try {
    const data = await db
      .select()
      .from(achievements)
      .where(ne(achievements.status, 'removed'))
      .orderBy(desc(achievements.year)); // 🕐 latest first

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('❌ Error fetching achievements:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch achievements' }, { status: 500 });
  }
}
