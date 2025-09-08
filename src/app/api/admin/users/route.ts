import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { userApprovals } from "@/src/drizzle/db/schemas/user_approvals";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Get all users
    const allUsers = await db.select().from(users);

    // 2. Get all approvals (with reason too)
    const approvals = await db.select().from(userApprovals);

    // 3. Merge approvals into each user
    const usersWithApprovals = allUsers.map((u) => {
      const userApprovalsList = approvals
        .filter((a) => a.userId === u.id)
        .map((a) => ({
          adminName: a.adminName,
          action: a.status as "approved" | "rejected",
          reason: a.reason || null, // 👈 include rejection reason
        }));

      // get latest rejection reason for the user (if any)
      const latestRejection = userApprovalsList.find(
        (a) => a.action === "rejected"
      );

      return {
        ...u,
        approvals: userApprovalsList,
        rejectionReason: latestRejection?.reason || null, // 👈 attach reason to user
      };
    });

    // 4. Split by status for frontend
    return NextResponse.json({
      pending: usersWithApprovals.filter((u) => u.status === "pending"),
      approved: usersWithApprovals.filter((u) => u.status === "approved"),
      rejected: usersWithApprovals.filter((u) => u.status === "rejected"),
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

