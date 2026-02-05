import { db } from '@/src/drizzle/db';
import { and, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { discussionLikes } from '@/src/drizzle/db/schemas/discussionLikes';

// ✅ Get likes count for a discussion
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discussionId = searchParams.get('discussionId');

    if (!discussionId) {
      return NextResponse.json(
        { success: false, message: 'discussionId is required' },
        { status: 400 }
      );
    }

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number)
      })
      .from(discussionLikes)
      .where(eq(discussionLikes.discussionId, Number(discussionId)));

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

// ✅ Like a discussion (One user can like only once)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const discussionId = Number(id);

    // Check if already liked
    const existing = await db
      .select()
      .from(discussionLikes)
      .where(
        and(
          eq(discussionLikes.discussionId, discussionId),
          eq(discussionLikes.userId, session.user.id)
        )
      );

    if (existing.length > 0) {
      // Unlike
      await db
        .delete(discussionLikes)
        .where(
          and(
            eq(discussionLikes.discussionId, discussionId),
            eq(discussionLikes.userId, session.user.id)
          )
        );

      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like
      await db.insert(discussionLikes).values({
        discussionId,
        userId: session.user.id
      });

      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Error liking discussion:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
