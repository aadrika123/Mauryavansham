import { db } from "@/src/drizzle/db";
import { discussionReplyLikes } from "@/src/drizzle/db/schemas/discussionReplyLikes";
import { discussionReplies } from "@/src/drizzle/db/schemas/discussionReplies";
import { eq, and, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

// ✅ Toggle like on a reply
export async function POST(
  req: Request,
  { params }: { params: { replyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const replyId = parseInt(params.replyId);
    if (!replyId) {
      return NextResponse.json(
        { success: false, message: "Invalid reply ID" },
        { status: 400 }
      );
    }

    // Check if reply exists
    const reply = await db
      .select()
      .from(discussionReplies)
      .where(eq(discussionReplies.id, replyId))
      .limit(1);

    if (reply.length === 0) {
      return NextResponse.json(
        { success: false, message: "Reply not found" },
        { status: 404 }
      );
    }

    // Check if user already liked this reply
    const existingLike = await db
      .select()
      .from(discussionReplyLikes)
      .where(
        and(
          eq(discussionReplyLikes.replyId, replyId),
          eq(discussionReplyLikes.userId, session.user.id)
        )
      )
      .limit(1);

    let isLiked = false;
    let likeCount = 0;

    if (existingLike.length > 0) {
      // Unlike - remove the like
      await db
        .delete(discussionReplyLikes)
        .where(
          and(
            eq(discussionReplyLikes.replyId, replyId),
            eq(discussionReplyLikes.userId, session.user.id)
          )
        );
      isLiked = false;
    } else {
      // Like - add the like
      await db.insert(discussionReplyLikes).values({
        replyId,
        userId: session.user.id,
      });
      isLiked = true;
    }

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(discussionReplyLikes)
      .where(eq(discussionReplyLikes.replyId, replyId));

    likeCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likeCount,
        replyId,
      },
    });
  } catch (error) {
    console.error("Error toggling reply like:", error);
    return NextResponse.json(
      { success: false, message: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
