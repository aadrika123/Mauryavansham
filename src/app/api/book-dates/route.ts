// app/api/ads/booked-dates/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { ads } from "@/src/drizzle/schema";
import { and, eq, gte } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placementId = searchParams.get("placementId");

    if (!placementId) {
      return NextResponse.json(
        { error: "placementId is required" },
        { status: 400 }
      );
    }

    const placementIdNum = Number(placementId);
    if (isNaN(placementIdNum)) {
      return NextResponse.json(
        { error: "Invalid placementId" },
        { status: 400 }
      );
    }

    const today = new Date();

    // ✅ Only fetch approved/active ads that are still valid
    const adsForPlacement = await db
      .select({
        fromDate: ads.fromDate,
        toDate: ads.toDate,
        status: ads.status, // make sure you have status column
      })
      .from(ads)
      .where(
        and(
          eq(ads.placementId, placementIdNum),
          eq(ads.status, "approved"), // sirf approved hi block karega
          gte(ads.toDate, today) // sirf future / running ads
        )
      );

    const bookedDates = adsForPlacement
      .filter((ad) => ad.fromDate && ad.toDate)
      .map((ad) => ({
        start: ad.fromDate!,
        end: ad.toDate!,
      }));

    return NextResponse.json(bookedDates);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return NextResponse.json([], { status: 200 });
  }
}
