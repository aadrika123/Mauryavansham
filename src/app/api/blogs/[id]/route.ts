import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/src/drizzle/db";
import { blogs } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/src/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const [blog] = await db.select().from(blogs).where(eq(blogs.id, params.id));
    const blogId = Number(params.id);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    const [blog] = await db.select().from(blogs).where(eq(blogs.id, blogId));

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // if (
    //   String(blog.authorId) !== String(session.user.id) &&
    //   session.user.role !== "admin" &&
    //   session.user.role !== "superAdmin"
    // ) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      summary,
      action,
      status,
      rejectionReason,
      imageUrl,
    } = body;

    const blogId = Number(params.id);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, blogId));

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // ✅ Admin actions (approve/reject)
    if (
      session.user.role === "admin" &&
      (status === "approved" || status === "rejected")
    ) {
      const [updatedBlog] = await db
        .update(blogs)
        .set({
          status,
          rejectionReason: status === "rejected" ? rejectionReason : null,
          approvedAt: status === "approved" ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, blogId)) // ✅ fix applied
        .returning();

      return NextResponse.json({ blog: updatedBlog });
    }

    // ✅ User actions (edit their own blogs)
    if (existingBlog.authorId.toString() !== session.user.id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingBlog.status !== "draft" && existingBlog.status !== "rejected" && existingBlog.status !== "pending") {
      return NextResponse.json(
        { error: "Cannot edit blog in current status" },
        { status: 400 }
      );
    }

    const newStatus = action === "submit" ? "pending" : "draft";

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title,
        content,
        summary,
        imageUrl: imageUrl || existingBlog.imageUrl,
        status: newStatus,
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, blogId)) // ✅ fix applied
      .returning();

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blogId = Number(params.id);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    const body = await request.json();
    const removeReason = body.reason;

    if (!removeReason) {
      return NextResponse.json({ error: "Remove reason is required" }, { status: 400 });
    }

    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, blogId));

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (
      existingBlog.authorId.toString() !== session.user.id.toString() &&
      session.user.role !== "admin" &&
      session.user.role !== "superAdmin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        status: "removed",
        removedBy: Number(session.user.id),
        removeReason,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, blogId))
      .returning();

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error removing blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

