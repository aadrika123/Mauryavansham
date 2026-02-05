import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { healthServices } from '@/src/drizzle/db/schemas/health_services';
import { eq, and } from 'drizzle-orm';

// ✅ POST → Register a new health/wellness center
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      centerName,
      category,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      offerings,
      branches,
      about,
      logoUrl,
      docUrls
    } = body;

    // Basic validation
    if (!centerName || !category || !ownerName || !phone)
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });

    // ✅ Always set status = "active" when creating new record
    await db.insert(healthServices).values({
      userId,
      centerName,
      category,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      offerings,
      branches,
      about,
      logoUrl,
      docUrls,
      status: 'active' // 👈 added
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error registering health/wellness service:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ GET → Fetch active centers (optionally by user)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  try {
    // Always filter by active status
    const conditions: any = [eq(healthServices.status, 'active')];

    if (userId) {
      conditions.push(eq(healthServices.userId, userId));
    }

    const data = await db
      .select()
      .from(healthServices)
      .where(and(...conditions))
      .orderBy(healthServices.createdAt);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching centers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch centers' }, { status: 500 });
  }
}
