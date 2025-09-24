import { NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const activeUsers = await db
      .select({
        id: users.id,
        name: users.name,
        photo: users.photo,
        city: users.city,
        occupation: users.occupation,
        userCode: users.userCode,
        designation: users.designation,
        professionGroup: users.professionGroup,
        profession: users.profession,


      })
      .from(users)
      .where(eq(users.isActive, true));

    return NextResponse.json(activeUsers);
  } catch (error) {
    console.error("Error fetching active users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
