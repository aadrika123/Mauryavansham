import { db } from '@/src/drizzle/db';
import { blogReactions } from '@/src/drizzle/schema';
import { authOptions } from '@/src/lib/auth';
// import { blogReactions } from "@/src/drizzle/schema/blogReactions";
import { getServerSession } from 'next-auth';

export async function POST(req: any, { params }: any) {
  const blogId = Number(params.id);
  const { comment, parentId } = await req.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.insert(blogReactions).values({
    blogId,
    userId,
    comment,
    parentId: parentId || null,
    targetType: parentId ? 'comment' : 'blog'
  });

  return Response.json({ success: true });
}
