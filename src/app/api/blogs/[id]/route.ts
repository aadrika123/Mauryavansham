import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/src/drizzle/db";
import { blogs } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/src/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [blog] = await db.select().from(blogs).where(eq(blogs.id, params.id));

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, summary, action, status, rejectionReason, imageUrl } = body;

    const [existingBlog] = await db.select().from(blogs).where(eq(blogs.id, params.id));

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Admin actions (approve/reject)
    if (session.user.role === "admin" && (status === "approved" || status === "rejected")) {
      const [updatedBlog] = await db
        .update(blogs)
        .set({
          status,
          rejectionReason: status === "rejected" ? rejectionReason : null,
          approvedAt: status === "approved" ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, params.id))
        .returning();

      return NextResponse.json({ blog: updatedBlog });
    }

    // User actions (edit their own blogs)
   if (existingBlog.authorId.toString() !== session.user.id.toString()) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}


    if (existingBlog.status !== "draft" && existingBlog.status !== "rejected") {
      return NextResponse.json({ error: "Cannot edit blog in current status" }, { status: 400 });
    }

    const newStatus = action === "submit" ? "pending" : "draft";

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title,
        content,
        summary,
        imageUrl: imageUrl || existingBlog.imageUrl, // <-- Update image
        status: newStatus,
        rejectionReason: null, // Clear rejection reason when resubmitting
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, params.id))
      .returning();

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
