import { db } from '@/src/drizzle/db';
import { blogReactions } from '@/src/drizzle/schema';
// import { blogReactions } from "@/src/drizzle/schema/blogReactions";
import { eq, and, sql, isNotNull } from 'drizzle-orm';

export async function GET(req: any, { params }: any) {
  const blogId = Number(params.id);

  // 📊 Like/Dislike counts for blog
  const likes = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogReactions)
    .where(
      and(eq(blogReactions.blogId, blogId), eq(blogReactions.isLiked, true), eq(blogReactions.targetType, 'blog'))
    );

  const dislikes = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogReactions)
    .where(
      and(eq(blogReactions.blogId, blogId), eq(blogReactions.isDisliked, true), eq(blogReactions.targetType, 'blog'))
    );

  // 💬 Fetch all comments + replies
  const comments = await db
    .select()
    .from(blogReactions)
    .where(and(eq(blogReactions.blogId, blogId), isNotNull(blogReactions.comment)));

  return Response.json({
    likes: likes[0]?.count || 0,
    dislikes: dislikes[0]?.count || 0,
    comments
  });
}
