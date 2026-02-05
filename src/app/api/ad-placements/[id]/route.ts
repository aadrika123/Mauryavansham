import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { sql } from 'drizzle-orm';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adId = parseInt(id, 10);
    console.log('Updating views for adId:', adId);

    if (isNaN(adId)) {
      return NextResponse.json({ error: 'Invalid ad ID' }, { status: 400 });
    }

    const result = await db.execute(sql`UPDATE ads SET views = views + 1 WHERE id = ${adId}`);

    console.log('Rows updated:', result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to increment ad views:', err);
    return NextResponse.json({ error: 'Failed to increment view' }, { status: 500 });
  }
}
