import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema"; 
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const city = searchParams.get("city") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const where: any[] = [];

    if (search) {
      where.push(
        sql`${users.name} ILIKE ${"%" + search + "%"} OR 
            ${users.email} ILIKE ${"%" + search + "%"} OR 
            ${users.phone} ILIKE ${"%" + search + "%"}`
      );
    }

    if (role !== "all") where.push(eq(users.role, role));
    if (city) where.push(eq(users.city, city));

    if (startDate) where.push(sql`${users.createdAt} >= ${startDate}`);
    if (endDate) where.push(sql`${users.createdAt} <= ${endDate}`);

    // Total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(where.length > 0 ? sql`${sql.join(where, sql` AND `)}` : sql`true`);

    const total = Number(totalResult[0]?.count || 0);

    // Paginated users
    const paginatedUsers = await db.query.users.findMany({
      where: where.length > 0 ? sql`${sql.join(where, sql` AND `)}` : undefined,
      limit,
      offset,
      orderBy: (u, { asc }) => [asc(u.name)],
    });

    return NextResponse.json({
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
