import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { coachingCenters } from "@/src/drizzle/db/schemas/coachingCenters";
import { and, eq, ilike, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 📄 Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // 🔍 Filters
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const search = searchParams.get("search");

    // 🧩 Build dynamic filters
    const whereConditions: any[] = [];

    if (status) {
      whereConditions.push(eq(coachingCenters.status, status));
    }

    if (city) {
      whereConditions.push(ilike(coachingCenters.city, `%${city}%`));
    }

    if (state) {
      whereConditions.push(ilike(coachingCenters.state, `%${state}%`));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(coachingCenters.centerName, `%${search}%`),
          ilike(coachingCenters.ownerName, `%${search}%`),
          ilike(coachingCenters.email, `%${search}%`),
          ilike(coachingCenters.phone, `%${search}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : sql`true`;

    // ✅ Get total count
    const totalQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(coachingCenters)
      .where(whereClause);

    const totalCount = Number(totalQuery[0]?.count || 0);

    // ✅ Get paginated data
    const data = await db
      .select()
      .from(coachingCenters)
      .where(whereClause)
      .orderBy(sql`${coachingCenters.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    // ✅ Return structured JSON
    return NextResponse.json({
      success: true,
      totalCount,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching education report:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
