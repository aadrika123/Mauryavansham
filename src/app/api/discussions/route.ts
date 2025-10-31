import { db } from "@/src/drizzle/db";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { discussions } from "@/src/drizzle/db/schemas/discussions";
import { discussionLikes, discussionReplies } from "@/src/drizzle/schema";

// ✅ Get All Discussions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const isLikedSql = userId
      ? sql<boolean>`BOOL_OR(${discussionLikes.userId} = ${userId})`.as("isLiked")
      : sql<boolean>`FALSE`.as("isLiked");

    const allDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        category: discussions.category,
        location: discussions.location,
        authorId: discussions.authorId,
        authorName: discussions.authorName,
        status: discussions.status,
        isCompleted: discussions.isCompleted,
        createdAt: discussions.createdAt,
        likeCount: sql<number>`COUNT(DISTINCT ${discussionLikes.id})`.as("likeCount"),
        replyCount: sql<number>`COUNT(DISTINCT ${discussionReplies.id})`.as("replyCount"),
        isLiked: isLikedSql,
      })
      .from(discussions)
      .where(eq(discussions.status, "approved"))
      .leftJoin(discussionLikes, eq(discussions.id, discussionLikes.discussionId))
      .leftJoin(discussionReplies, eq(discussions.id, discussionReplies.discussionId))
      .groupBy(discussions.id)
      .orderBy(desc(discussions.createdAt));

    return NextResponse.json({ success: true, data: allDiscussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}


// ✅ Create Discussion (Only logged-in user)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, category, location } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const newDiscussion = await db
      .insert(discussions)
      .values({
        title,
        content,
        category,
        location,
        authorId: session.user.id,
        authorName: session.user.name || "Anonymous",
        status: "approved",
      })
      .returning();

    return NextResponse.json({ success: true, data: newDiscussion[0] });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
