import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema"; // apne schema ka path check kar lena
import { eq, like, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // Query params extract karna
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";

    const offset = (page - 1) * limit;

    // WHERE conditions build karna
    const where: any[] = [];
    if (search) {
      where.push(
        sql`${users.name} ILIKE ${"%" + search + "%"} OR 
            ${users.email} ILIKE ${"%" + search + "%"} OR 
            ${users.phone} ILIKE ${"%" + search + "%"}`
      );
    }
    if (role !== "all") {
      where.push(eq(users.role, role));
    }

    // Total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        where.length > 0 ? sql`${sql.join(where, sql` AND `)}` : sql`true`
      );

    const total = Number(totalResult[0]?.count || 0);

    // Paginated users
    const paginatedUsers = await db.query.users.findMany({
      where: where.length > 0 ? sql`${sql.join(where, sql` AND `)}` : undefined,
      limit,
      offset,
      orderBy: (u, { desc }) => [desc(u.id)],
    });

    return NextResponse.json({
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // 👈 add this
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
