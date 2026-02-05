// app/api/ad-placements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { ads, adPlacements } from '@/src/drizzle/schema';
import { eq, and, lte, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // 👇 convert Date -> YYYY-MM-DD string
    const today = new Date().toISOString().split('T')[0];

    const placementsWithAds = await db
      .select({
        id: ads.id,
        bannerImageUrl: ads.bannerImageUrl,
        views: ads.views,
        placementId: adPlacements.id,
        fromDate: ads.fromDate,
        toDate: ads.toDate,
        adUrl: ads.adUrl
      })
      .from(adPlacements)
      .leftJoin(ads, eq(adPlacements.id, ads.placementId))
      .where(
        and(
          eq(ads.status, 'approved'), // sirf approved ads
          lte(ads.fromDate, today), // start ho chuka hai
          gte(ads.toDate, today) // abhi khatam nahi hua
        )
      );

    return NextResponse.json(placementsWithAds);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
