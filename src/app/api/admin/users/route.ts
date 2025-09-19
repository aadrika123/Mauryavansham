import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { userApprovals } from "@/src/drizzle/db/schemas/user_approvals";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1️⃣ Pagination params
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);

    // 2️⃣ Tab filter
    const tab = (searchParams.get("tab") as "pending" | "approved" | "rejected") || "pending";

    // 3️⃣ Fetch all users
    const allUsers = await db.select().from(users);

    // 4️⃣ Filter users by tab
    const filteredUsers = allUsers.filter((u) => u.status === tab);

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // 5️⃣ Paginate filtered users
    const offset = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(offset, offset + pageSize);

    // 6️⃣ Fetch approvals
    const approvals = await db.select().from(userApprovals);

    const usersWithApprovals = paginatedUsers.map((u) => {
      const userApprovalsList = approvals
        .filter((a) => a.userId === u.id)
        .map((a) => ({
          adminName: a.adminName,
          action: a.status as "approved" | "rejected",
          reason: a.reason || null,
        }));

      const latestRejection = userApprovalsList.find((a) => a.action === "rejected");

      return {
        ...u,
        approvals: userApprovalsList,
        rejectionReason: latestRejection?.reason || null,
      };
    });

    // 7️⃣ Return JSON response
    return NextResponse.json({
      totalItems,
      page,
      pageSize,
      totalPages,
      users: usersWithApprovals,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
