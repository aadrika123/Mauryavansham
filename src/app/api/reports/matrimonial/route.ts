import { NextRequest, NextResponse } from "next/server";
import { and, between, eq, ilike, or, sql } from "drizzle-orm";
import { profiles, users } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";

// ✅ GET /api/reports/matrimonial
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const city = url.searchParams.get("city") || "";
    const state = url.searchParams.get("state") || "";
    const mobile = url.searchParams.get("mobile") || "";
    const dateFrom = url.searchParams.get("dateFrom") || "";
    const dateTo = url.searchParams.get("dateTo") || "";
    const isPremium = url.searchParams.get("isPremium");
    const isVerified = url.searchParams.get("isVerified");
    const isActive = url.searchParams.get("isActive");

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(profiles.name, `%${search}%`),
          ilike(profiles.email, `%${search}%`),
          ilike(profiles.occupation, `%${search}%`),
          ilike(profiles.companyOrganization, `%${search}%`)
        )
      );
    }

    if (city) conditions.push(ilike(users.city, `%${city}%`));
    if (state) conditions.push(ilike(users.state, `%${state}%`));
    if (mobile) conditions.push(ilike(profiles.phoneNo, `%${mobile}%`));

    if (dateFrom && dateTo) {
      conditions.push(between(sql`DATE(${profiles.createdAt})`, dateFrom, dateTo));
    }

    if (isPremium !== "" && isPremium !== null)
      conditions.push(eq(profiles.isPremium, isPremium === "true"));
    if (isVerified !== "" && isVerified !== null)
      conditions.push(eq(profiles.isVerified, isVerified === "true"));
    if (isActive !== "" && isActive !== null)
      conditions.push(eq(profiles.isActive, isActive === "true"));

    const whereClause = conditions.length > 0 ? and(...conditions) : sql`TRUE`;

    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(profiles)
      .innerJoin(users, eq(users.id, sql`${profiles.userId}::int`))
      .where(whereClause);

    const totalCount = countQuery[0]?.count || 0;

    const result = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(users.id, sql`${profiles.userId}::int`))
      .where(whereClause)
      .orderBy(profiles.createdAt)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        success: true,
        data: result,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error generating matrimonial report:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
