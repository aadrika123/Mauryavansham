import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { users, userChildren, userSiblings } from '@/src/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [childrenCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userChildren)
      .where(eq(userChildren.userId, userId));

    const [siblingsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userSiblings)
      .where(eq(userSiblings.userId, userId));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    let completeness = 0;
    const fields = [
      userProfile?.fatherName,
      userProfile?.motherName,
      userProfile?.grandfatherName,
      userProfile?.dateOfBirth,
      userProfile?.occupation,
      userProfile?.education
    ];
    completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

    let generations = 1; // user
    if (Number(childrenCount.count) > 0) generations++;
    if (Number(siblingsCount.count) > 0) generations++;

    const totalMembers = Number(childrenCount.count) + Number(siblingsCount.count) + 1; // +1 for user

    return NextResponse.json({
      familyTree: {
        totalMembers,
        newThisMonth: 0, // Can be tracked with createdAt if added to schema
        completeness,
        generations,
        children: Number(childrenCount.count),
        siblings: Number(siblingsCount.count)
      }
    });
  } catch (error) {
    console.error('[v0] Family tree analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch family tree data' }, { status: 500 });
  }
}
