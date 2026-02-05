import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { blogs, users, blogReactions } from '@/src/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);

    // Get top blogs based on views and reactions
    const topBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        summary: blogs.summary,
        authorId: blogs.authorId,
        views: blogs.views,
        createdAt: blogs.createdAt
      })
      .from(blogs)
      .where(eq(blogs.status, 'approved'))
      .orderBy(desc(blogs.views))
      .limit(10);

    // Get author names and calculate match scores
    const recommendedContent = await Promise.all(
      topBlogs.map(async blog => {
        // Get author name
        const author = await db.select({ name: users.name }).from(users).where(eq(users.id, blog.authorId)).limit(1);

        // Get reaction count
        const reactions = await db
          .select({ count: sql<number>`count(*)` })
          .from(blogReactions)
          .where(eq(blogReactions.blogId, blog.id));

        const reactionCount = Number(reactions[0]?.count || 0);

        // Calculate match score
        let matchScore = 70; // Base score

        // High views = +15 points
        if (blog.views && blog.views > 100) {
          matchScore += 15;
        } else if (blog.views && blog.views > 50) {
          matchScore += 10;
        }

        // Many reactions = +10 points
        if (reactionCount > 20) {
          matchScore += 10;
        } else if (reactionCount > 10) {
          matchScore += 5;
        }

        matchScore = Math.min(matchScore, 100);

        // Estimate read time based on summary length
        const wordCount = blog.summary.split(' ').length;
        const readTime = Math.max(Math.ceil(wordCount / 200), 3);

        // Determine reason
        let reason = 'Popular in your community';
        if (blog.views && blog.views > 100) {
          reason = 'Trending content';
        }
        if (reactionCount > 20) {
          reason = 'Highly engaged content';
        }

        return {
          id: blog.id,
          title: blog.title,
          author: author[0]?.name || 'Unknown Author',
          type: 'Blog',
          readTime: `${readTime} min`,
          matchScore,
          reason,
          views: blog.views || 0,
          reactions: reactionCount
        };
      })
    );

    // Sort by match score
    recommendedContent.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(recommendedContent.slice(0, 6));
  } catch (error) {
    console.error('Error fetching content recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
