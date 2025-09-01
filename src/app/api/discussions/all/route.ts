// /api/discussions/all/route.ts
import { db } from "@/src/drizzle/db";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { discussions } from "@/src/drizzle/db/schemas/discussions";
import { discussionLikes } from "@/src/drizzle/schema";

export async function GET() {
  try {
    const allDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        category: discussions.category,
        location: discussions.location,
        authorId: discussions.authorId,
        authorName: discussions.authorName,
        createdAt: discussions.createdAt,
        status: discussions.status, // ✅ admin ko status bhi dikhana hoga
        likeCount: sql<number>`COUNT(${discussionLikes.id})`.as("likeCount"),
        rejectedBy: discussions.rejectedBy, // ✅ agar rejected hai to kisko reject kiya
        rejectedReason: discussions.rejectionReason, // ✅ reason bhi dikhana hoga
        approvedBy: discussions.approvedBy, // ✅ agar approved hai to kisko approve kiya
      })
      .from(discussions)
      .leftJoin(
        discussionLikes,
        eq(discussions.id, discussionLikes.discussionId)
      )
      .groupBy(discussions.id)
      .orderBy(desc(discussions.createdAt));

    return NextResponse.json({ success: true, data: allDiscussions });
  } catch (error) {
    console.error("Error fetching all discussions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}
