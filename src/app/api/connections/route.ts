import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { connections } from "@/src/drizzle/db/schemas/connections";
import { sql } from "drizzle-orm";

// POST → accept/connect
export async function POST(req: NextRequest) {
  const { user1Id, user2Id } = await req.json();

  if (!user1Id || !user2Id) {
    return NextResponse.json({ error: "Missing user ids" }, { status: 400 });
  }

  const [conn] = await db.insert(connections).values({
    user1Id,
    user2Id,
  }).returning();

  return NextResponse.json(conn);
}

// GET → check if connected
export async function GET(req: NextRequest) {
  const user1Id = Number(req.nextUrl.searchParams.get("user1Id"));
  const user2Id = Number(req.nextUrl.searchParams.get("user2Id"));

  const conn = await db.select().from(connections).where(
    sql`${connections.user1Id} = ${user1Id} AND ${connections.user2Id} = ${user2Id} 
      OR ${connections.user1Id} = ${user2Id} AND ${connections.user2Id} = ${user1Id}`
  );

  return NextResponse.json({ connected: conn.length > 0 });
}
