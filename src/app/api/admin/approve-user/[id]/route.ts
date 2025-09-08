import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { eq } from "drizzle-orm";
import { users, userApprovals } from "@/src/drizzle/schema";

const REQUIRED_APPROVALS = 3;

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id);
    const { adminId, adminName } = await req.json();

    // 1️⃣ Check if this admin already acted
    const existing = await db.query.userApprovals.findFirst({
      where: (ua) => eq(ua.userId, userId) && eq(ua.adminId, adminId),
    });

    if (existing) {
      // update decision to approved
      await db
        .update(userApprovals)
        .set({ status: "approved", reason: null })
        .where(eq(userApprovals.id, existing.id));
    } else {
      // insert new approval
      await db.insert(userApprovals).values({
        userId,
        adminId,
        adminName,
        status: "approved",
      });
    }

    // 2️⃣ Recalculate status
    const approvals = await db.query.userApprovals.findMany({
      where: (ua) => eq(ua.userId, userId),
    });

    const approvedCount = approvals.filter((a) => a.status === "approved").length;
    const rejectedCount = approvals.filter((a) => a.status === "rejected").length;

    let newStatus = "pending";
    let isApproved = false;

    if (rejectedCount > 0) {
      newStatus = "rejected";
      isApproved = false;
    } else if (approvedCount >= REQUIRED_APPROVALS) {
      newStatus = "approved";
      isApproved = true;
    }

    await db
      .update(users)
      .set({ status: newStatus, isApproved })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "User approval recorded." });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Failed to approve user" }, { status: 500 });
  }
}
