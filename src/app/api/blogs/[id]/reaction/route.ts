import { db } from '@/src/drizzle/db';
import { blogReactions } from '@/src/drizzle/schema';
import { authOptions } from '@/src/lib/auth';
import { eq, and, isNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogId = Number(id);
  const { isLiked, isDisliked, targetType, parentId } = await req.json();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const safeTargetType = targetType || 'blog'; // 🧩 fallback value
  const safeParentId = parentId ?? null; // 🧩 ensure null not undefined

  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 🧩 Check if already reacted
  const existing = await db
    .select()
    .from(blogReactions)
    .where(
      and(
        eq(blogReactions.blogId, blogId),
        eq(blogReactions.userId, userId),
        eq(blogReactions.targetType, safeTargetType),
        safeParentId ? eq(blogReactions.parentId, safeParentId) : isNull(blogReactions.parentId)
      )
    );

  if (existing.length > 0) {
    const current = existing[0];

    // 🔁 Logic
    if (isLiked && current.isLiked) {
      return Response.json({ message: 'Already liked', success: false });
    } else if (isDisliked && current.isDisliked) {
      return Response.json({ message: 'Already disliked', success: false });
    } else if (isLiked && current.isDisliked) {
      await db.update(blogReactions).set({ isLiked: true, isDisliked: false }).where(eq(blogReactions.id, current.id));
    } else if (isDisliked && current.isLiked) {
      await db.update(blogReactions).set({ isLiked: false, isDisliked: true }).where(eq(blogReactions.id, current.id));
    }

    return Response.json({ success: true, message: 'Reaction updated' });
  }

  // 🆕 Insert first time reaction (safe insert)
  try {
    await db.insert(blogReactions).values({
      blogId,
      userId,
      isLiked,
      isDisliked,
      targetType: safeTargetType,
      parentId: safeParentId
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return Response.json({ message: 'Already reacted', success: false });
    }
    console.error('Error inserting reaction:', error);
    return Response.json({ error: 'Failed to insert reaction' }, { status: 500 });
  }

  return Response.json({ success: true });
}
