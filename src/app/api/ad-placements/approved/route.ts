// app/api/ad-placements/route.ts (example)
import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { ads, adPlacements } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const placementsWithAds = await db
      .select({
        id: adPlacements.id,
        bannerImageUrl: ads.bannerImageUrl,
        // link: ads.link,
      })
      .from(adPlacements)
      .leftJoin(ads, eq(adPlacements.id, ads.placementId))
      .where(eq(ads.status, "approved")); // sirf approved ads
    return NextResponse.json(placementsWithAds);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
