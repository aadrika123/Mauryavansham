import { db } from '@/src/drizzle/db';
import { adPlacements } from '@/src/drizzle/schema';
import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const placements = await db.select().from(adPlacements).orderBy(asc(adPlacements.id)); // id ke ascending order me

    return NextResponse.json(placements || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch placements' }, { status: 500 });
  }
}
