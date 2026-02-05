// /src/app/api/all-profiles/[userId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq } from 'drizzle-orm';
import { profiles } from '@/src/drizzle/db/schemas/createProfile.schema';

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch all profiles for the given userId
    const userProfiles = await db.query.profiles.findMany({
      where: eq(profiles.userId, userId)
    });

    return NextResponse.json({ success: true, data: userProfiles });
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}
