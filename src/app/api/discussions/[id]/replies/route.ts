import { db } from "@/src/drizzle/db";
// import { discussionReplies } from "@/src/drizzle/schema/discussionReplies"
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { discussionReplies } from "@/src/drizzle/db/schemas/discussionReplies";

// ✅ Get replies for a discussion
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // pathname: /api/discussions/2/replies
    const pathSegments = url.pathname.split("/"); // ["", "api", "discussions", "2", "replies"]
    const discussionId = pathSegments[3]; // 2

    if (!discussionId) {
      return NextResponse.json(
        { success: false, message: "discussionId is required" },
        { status: 400 }
      );
    }

    const replies = await db
      .select()
      .from(discussionReplies)
      .where(eq(discussionReplies.discussionId, Number(discussionId)))
      .orderBy(desc(discussionReplies.createdAt));

    return NextResponse.json({ success: true, data: replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// ✅ Post a reply
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
    const { discussionId, content } = body;

    if (!discussionId || !content) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const newReply = await db
      .insert(discussionReplies)
      .values({
        discussionId,
        content,
        userId: session.user.id,
        userName: session.user.name || "Anonymous",
      })
      .returning();

    return NextResponse.json({ success: true, data: newReply[0] });
  } catch (error) {
    console.error("Error posting reply:", error);
    return NextResponse.json(
      { success: false, message: "Failed to post reply" },
      { status: 500 }
    );
  }
}
