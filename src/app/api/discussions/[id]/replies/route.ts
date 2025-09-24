import { db } from "@/src/drizzle/db";
import { eq, desc, and, count, sql, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { discussionReplies } from "@/src/drizzle/db/schemas/discussionReplies";
import { discussionReplyLikes } from "@/src/drizzle/db/schemas/discussionReplyLikes";

// ✅ OPTIMIZED: Get replies with likes using batch queries
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const discussionId = pathSegments[3];

    if (!discussionId) {
      return NextResponse.json(
        { success: false, message: "discussionId is required" },
        { status: 400 }
      );
    }

    // Step 1: Get all replies for the discussion
    const replies = await db
      .select()
      .from(discussionReplies)
      .where(eq(discussionReplies.discussionId, Number(discussionId)))
      .orderBy(desc(discussionReplies.createdAt));

    if (replies.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Step 2: Get reply IDs for batch processing
    const replyIds = replies.map(r => r.id);

    // Step 3: Get like counts for all replies in one query
    const likeCounts = await db
      .select({
        replyId: discussionReplyLikes.replyId,
        count: count()
      })
      .from(discussionReplyLikes)
      .where(inArray(discussionReplyLikes.replyId, replyIds))
      .groupBy(discussionReplyLikes.replyId);

    // Step 4: Get user's likes (if logged in) in one query
    let userLikes: { replyId: number }[] = [];
    if (session?.user) {
      userLikes = await db
        .select({ replyId: discussionReplyLikes.replyId })
        .from(discussionReplyLikes)
        .where(
          and(
            inArray(discussionReplyLikes.replyId, replyIds),
            eq(discussionReplyLikes.userId, session.user.id)
          )
        );
    }

    // Step 5: Create lookup maps for efficient processing
    const likeCountMap = new Map();
    likeCounts.forEach(lc => {
      likeCountMap.set(lc.replyId, Number(lc.count));
    });

    const userLikesSet = new Set();
    userLikes.forEach(ul => {
      userLikesSet.add(ul.replyId);
    });

    // Step 6: Transform replies with like data
    const transformedReplies = replies.map(reply => ({
      ...reply,
      authorName: reply.userName,
      authorId: reply.userId,
      likeCount: likeCountMap.get(reply.id) || 0,
      isLiked: userLikesSet.has(reply.id),
      replies: [] // Will be populated by frontend nesting logic
    }));

    console.log('Replies with likes (optimized):', transformedReplies);

    return NextResponse.json({ success: true, data: transformedReplies });

  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// Keep your existing POST function as is...
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
    const { discussionId, content, parentId } = body;

    if (!discussionId || !content) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Validate parentId exists if provided
    if (parentId) {
      const parentReply = await db
        .select()
        .from(discussionReplies)
        .where(eq(discussionReplies.id, parentId))
        .limit(1);

      if (parentReply.length === 0) {
        return NextResponse.json(
          { success: false, message: "Parent reply not found" },
          { status: 400 }
        );
      }
    }

    const newReply = await db
      .insert(discussionReplies)
      .values({
        discussionId,
        content,
        userId: session.user.id,
        userName: session.user.name || "Anonymous",
        parentId: parentId || null,
      })
      .returning();

    // Transform for frontend
    const transformedReply = {
      ...newReply[0],
      authorName: newReply[0].userName,
      authorId: newReply[0].userId,
      likeCount: 0,
      isLiked: false,
      replies: []
    };

    return NextResponse.json({ success: true, data: transformedReply });
  } catch (error) {
    console.error("Error posting reply:", error);
    return NextResponse.json(
      { success: false, message: "Failed to post reply" },
      { status: 500 }
    );
  }
}