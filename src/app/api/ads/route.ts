import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { ads, users } from '@/src/drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

// helper function to safely parse DB date values
function parseDbDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val.includes('-')) {
    // assume DB returns yyyy-mm-dd
    const [year, month, day] = val.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(val);
}

// helper function to parse DD-MM-YYYY into Date
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`); // safe format YYYY-MM-DD
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const conditions = [];
    if (userId) conditions.push(eq(ads.userId, userId));
    if (status) conditions.push(eq(ads.status, status as any));

    const query = db
      .select({
        id: ads.id,
        title: ads.title,
        bannerImageUrl: ads.bannerImageUrl,
        fromDate: ads.fromDate,
        toDate: ads.toDate,
        status: ads.status,
        createdAt: ads.createdAt,
        updatedAt: ads.updatedAt,
        approvedAt: ads.approvedAt,
        rejectionReason: ads.rejectionReason,
        placementId: ads.placementId,
        viewCount: ads.views,
        approvedBy: ads.approvedBy,
        rejectedBy: ads.rejectedBy,
        adUrl: ads.adUrl,
        user: {
          id: users.id,
          name: users.name,
          email: users.email
        }
      })
      .from(ads)
      .leftJoin(users, eq(ads.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined) // ✅ yahan fix
      .orderBy(desc(ads.createdAt));

    // combine filters
    // const conditions = [];
    // if (userId) conditions.push(eq(ads.userId, userId));
    // if (status) conditions.push(eq(ads.status, status as any));
    // if (conditions.length > 0) {
    //   query = query.where(and(...conditions));
    // }

    const result = await query;

    // Calculate days left for each ad
    const adsWithDaysLeft = result.map(ad => {
      const today = new Date();
      const fromDate = parseDbDate(ad.fromDate);
      const toDate = parseDbDate(ad.toDate);

      let daysLeft = 0;
      let isActive = false;
      let isExpired = false;

      if (ad.status === 'approved') {
        if (today < fromDate) {
          // Ad hasn't started yet
          daysLeft = Math.ceil((fromDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        } else if (today >= fromDate && today <= toDate) {
          // Ad is currently active
          isActive = true;
          daysLeft = Math.ceil((toDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          // Ad has expired
          isExpired = true;
          daysLeft = 0;
        }
      }

      return {
        ...ad,
        daysLeft,
        isActive,
        isExpired
      };
    });

    return NextResponse.json({ ads: adsWithDaysLeft });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, bannerImageUrl, fromDate, toDate, placementId, adUrl } = body;

    if (!title || !bannerImageUrl || !fromDate || !toDate || !placementId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse DD-MM-YYYY format safely
    const from = parseDate(fromDate);
    const to = parseDate(toDate);

    // Normalize dates (ignore time part)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    // Validation
    if (from < today) {
      return NextResponse.json({ error: 'Start date cannot be in the past' }, { status: 400 });
    }
    if (to <= from) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    // Insert new Ad
    const [newAd] = await db
      .insert(ads)
      .values({
        title: String(title),
        bannerImageUrl: String(bannerImageUrl),
        fromDate: from,
        toDate: to,
        placementId: Number(placementId),
        userId: Number(session.user.id),
        status: 'pending',
        adUrl: adUrl ? String(adUrl) : null
      })
      .returning();

    return NextResponse.json({ ad: newAd }, { status: 201 });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
