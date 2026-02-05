import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { blogs, users } from '@/src/drizzle/schema';
import { eq, desc, sql, and, type SQL } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    // Build conditions
    const conditions: SQL<unknown>[] = [];
    if (userId) conditions.push(eq(blogs.authorId, Number(userId)));
    if (status) conditions.push(eq(blogs.status, status as any));

    // Build base select with subquery for removedByName
    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        summary: blogs.summary,
        content: blogs.content,
        imageUrl: blogs.imageUrl,
        status: blogs.status,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        approvedAt: blogs.approvedAt,
        rejectionReason: blogs.rejectionReason,
        removeReason: blogs.removeReason,
        removedBy: blogs.removedBy,
        removedByName: sql<string>`(SELECT name FROM users WHERE id = ${blogs.removedBy})`,
        author: {
          id: users.id,
          name: users.name,
          email: users.email
        }
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(blogs.createdAt));

    return NextResponse.json({ blogs: result });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, summary, action, imageUrl } = body;

    if (!title || !content || !summary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const status = action === 'submit' ? 'pending' : 'draft';

    const [newBlog] = await db
      .insert(blogs)
      .values({
        title,
        content,
        summary,
        authorId: Number(session.user.id),
        status: status as any,
        imageUrl: imageUrl || null
      })
      .returning();

    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
