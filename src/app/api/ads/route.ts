import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"
import { db } from "@/src/drizzle/db";
import { ads, users } from "@/src/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { authOptions } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    let query = db
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
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(ads)
      .leftJoin(users, eq(ads.userId, users.id))
      .orderBy(desc(ads.createdAt));

    // Filter by user if specified (for user's own ads)
    if (userId) {
      query = query.where(eq(ads.userId, userId));
    }

    // Filter by status if specified
    if (status) {
      query = query.where(eq(ads.status, status as any));
    }

    const result = await query;

    // Calculate days left for each ad
    const adsWithDaysLeft = result.map((ad) => {
      const today = new Date();
      const toDate = new Date(ad.toDate);
      const fromDate = new Date(ad.fromDate);

      let daysLeft = 0;
      let isActive = false;
      let isExpired = false;

      if (ad.status === "approved") {
        if (today < fromDate) {
          // Ad hasn't started yet
          daysLeft = Math.ceil(
            (fromDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
        } else if (today >= fromDate && today <= toDate) {
          // Ad is currently active
          isActive = true;
          daysLeft = Math.ceil(
            (toDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
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
        isExpired,
      };
    });

    return NextResponse.json({ ads: adsWithDaysLeft });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, bannerImageUrl, fromDate, toDate, placementId } = body;

    if (!title || !bannerImageUrl || !fromDate || !toDate || !placementId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert to Date objects
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Normalize dates (ignore time part)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    // Validation
    if (from < today) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }
    if (to <= from) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Insert new Ad
    const [newAd] = await db
      .insert(ads)
      .values({
        title,
        bannerImageUrl,
        fromDate: from,
        toDate: to,
        placementId,
        userId: session.user.id,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ ad: newAd }, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
