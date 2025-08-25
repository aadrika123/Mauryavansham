import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "@/src/drizzle/schema"; // path confirm kar lo

// Helper function: profile completion %
const calculateProfileCompletion = (user: any) => {
  let fields = ["phone", "gender", "dateOfBirth", "address", "photo"];
  let filled = fields.filter((f) => user[f]);
  return Math.round((filled.length / fields.length) * 100);
};

// GET /api/users/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("User ID param:", id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(id)),
    });

    console.log("User from DB:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // calculate profile completion
    const completion = calculateProfileCompletion(user);

    return NextResponse.json(
      { data: user, profileCompletion: completion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
