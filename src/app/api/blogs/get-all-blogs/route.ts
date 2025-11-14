import { NextRequest, NextResponse } from "next/server";
import { eq, isNotNull, sql } from "drizzle-orm";
import { blogs, users, blogReactions } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || null;

    // 1️⃣ Fetch approved blogs with author
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
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(eq(blogs.status, "approved"))
      .orderBy(blogs.createdAt);

    // 2️⃣ Fetch all reactions
    const allReactions = await db.select().from(blogReactions);

    // 3️⃣ Fetch all comments with author info (cast users.id to text)
    const allComments = await db
      .select({
        id: blogReactions.id,
        blogId: blogReactions.blogId,
        userId: blogReactions.userId,
        comment: blogReactions.comment,
        parentId: blogReactions.parentId,
        targetType: blogReactions.targetType,
        isLiked: blogReactions.isLiked,
        isDisliked: blogReactions.isDisliked,
        createdAt: blogReactions.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(blogReactions)
      .leftJoin(
        users,
        sql`${blogReactions.userId} = ${users.id}::text`
      )
      .where(isNotNull(blogReactions.comment))
      .orderBy(blogReactions.createdAt);

    // 4️⃣ Merge blogs + reactions + comments
    const formatted = result.map((b) => {
      const blogReacts = allReactions.filter((r) => r.blogId === b.id);
      const likesCount = blogReacts.filter((r) => r.isLiked).length;
      const dislikesCount = blogReacts.filter((r) => r.isDisliked).length;

      const userReaction =
        blogReacts.find((r) => r.userId === currentUserId) || {
          isLiked: false,
          isDisliked: false,
        };

      const blogCommentsList = allComments
        .filter((c) => c.blogId === b.id && c.parentId === null)
        .map((c) => ({
          id: c.id,
          blogId: c.blogId,
          userId: c.userId,
          comment: c.comment,
          parentId: c.parentId,
          targetType: c.targetType,
          isLiked: c.isLiked,
          isDisliked: c.isDisliked,
          createdAt: c.createdAt,
          author: {
            id: c.authorId,
            name: c.authorName,
            email: c.authorEmail,
          },
          replies: allComments
            .filter((r) => r.parentId === c.id)
            .map((r) => ({
              id: r.id,
              blogId: r.blogId,
              userId: r.userId,
              comment: r.comment,
              parentId: r.parentId,
              targetType: r.targetType,
              isLiked: r.isLiked,
              isDisliked: r.isDisliked,
              createdAt: r.createdAt,
              author: {
                id: r.authorId,
                name: r.authorName,
                email: r.authorEmail,
              },
            })),
        }));

      return {
        ...b,
        likesCount,
        dislikesCount,
        userReaction,
        comments: blogCommentsList,
      };
    });

    return NextResponse.json({ blogs: formatted });
  } catch (error) {
    console.error("Error fetching approved blogs with comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
