import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
// import { healthServices } from "@/src/drizzle/db/schemas/healthServices";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { healthServices } from "@/src/drizzle/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const search = searchParams.get("search");

    const whereConditions: any[] = [];

    if (status) {
      whereConditions.push(eq(healthServices.status, status));
    }

    if (city) {
      whereConditions.push(ilike(healthServices.city, `%${city}%`));
    }

    if (state) {
      whereConditions.push(ilike(healthServices.state, `%${state}%`));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(healthServices.centerName, `%${search}%`),
          ilike(healthServices.ownerName, `%${search}%`),
          ilike(healthServices.email, `%${search}%`),
          ilike(healthServices.phone, `%${search}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : sql`true`;

    const totalQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(healthServices)
      .where(whereClause);

    const totalCount = Number(totalQuery[0]?.count || 0);

    const data = await db
      .select()
      .from(healthServices)
      .where(whereClause)
      .orderBy(sql`${healthServices.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      totalCount,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching health services report:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
