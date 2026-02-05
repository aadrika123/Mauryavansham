import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { achievements } from '@/src/drizzle/schema';
import { and, eq, sql, type SQL } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    // ✅ Dynamic filters
    const conditions: SQL<unknown>[] = [];

    if (status) conditions.push(eq(achievements.status, status as any));
    if (category) conditions.push(eq(achievements.category, category as any));

    // ✅ Execute query with conditions
    let allData = await db
      .select()
      .from(achievements)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${achievements.createdAt} DESC`);

    // ✅ Search filter (applied in memory for now)
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      allData = allData.filter(
        a =>
          a.name.toLowerCase().includes(searchLower) ||
          a.achievementTitle.toLowerCase().includes(searchLower) ||
          a.location.toLowerCase().includes(searchLower)
      );
    }

    // ✅ Pagination
    const totalCount = allData.length;
    const paginatedData = allData.slice(offset, offset + limit);

    return NextResponse.json({
      achievements: paginatedData,
      totalCount,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching achievements report:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements report' }, { status: 500 });
  }
}
