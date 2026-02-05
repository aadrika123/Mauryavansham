import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { discussions, discussionLikes, discussionReplies, discussionReplyLikes } from '@/src/drizzle/schema';
import { eq, like, gte, lte, and, sql, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';

    const offset = (page - 1) * limit;

    // Build filter conditions
    const validStatuses = ['pending', 'approved', 'rejected'] as const;
    type DiscussionStatus = (typeof validStatuses)[number];

    const statusParam = searchParams.get('status') as DiscussionStatus | null;

    const conditions = [];
    if (search) conditions.push(like(discussions.title, `%${search}%`));
    if (category) conditions.push(eq(discussions.category, category));

    if (statusParam && validStatuses.includes(statusParam)) {
      conditions.push(eq(discussions.status, statusParam));
    }
    if (dateFrom) conditions.push(gte(discussions.createdAt, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(discussions.createdAt, new Date(dateTo)));

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch discussions with counts using joins and groupBy
    const data = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        category: discussions.category,
        location: discussions.location,
        authorId: discussions.authorId,
        authorName: discussions.authorName,
        status: discussions.status,
        approvedBy: discussions.approvedBy,
        approvedById: discussions.approvedById,
        approvedAt: discussions.approvedAt,
        rejectedBy: discussions.rejectedBy,
        rejectedById: discussions.rejectedById,
        rejectedAt: discussions.rejectedAt,
        rejectionReason: discussions.rejectionReason,
        isCompleted: discussions.isCompleted,
        createdAt: discussions.createdAt,
        updatedAt: discussions.updatedAt,
        likesCount: sql<number>`COUNT(DISTINCT ${discussionLikes.id})`.as('likesCount'),
        repliesCount: sql<number>`COUNT(DISTINCT ${discussionReplies.id})`.as('repliesCount'),
        replyLikesCount: sql<number>`COUNT(DISTINCT ${discussionReplyLikes.id})`.as('replyLikesCount')
      })
      .from(discussions)
      .leftJoin(discussionLikes, eq(discussions.id, discussionLikes.discussionId))
      .leftJoin(discussionReplies, eq(discussions.id, discussionReplies.discussionId))
      .leftJoin(discussionReplyLikes, eq(discussionReplies.id, discussionReplyLikes.replyId))
      .where(whereCondition)
      .groupBy(discussions.id)
      .orderBy(desc(discussions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${discussions.id})`.as('count')
      })
      .from(discussions)
      .leftJoin(discussionLikes, eq(discussions.id, discussionLikes.discussionId))
      .leftJoin(discussionReplies, eq(discussions.id, discussionReplies.discussionId))
      .leftJoin(discussionReplyLikes, eq(discussionReplies.id, discussionReplyLikes.replyId))
      .where(whereCondition);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
