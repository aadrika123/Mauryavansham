import { db } from "@/src/drizzle/db";
import { businesses } from "@/src/drizzle/schema";
import { authOptions } from "@/src/lib/auth";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log(session);
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userBusinesses = await db
    .select()
    .from(businesses)
    .where(eq(businesses.userId, Number(session.user.id)));

  return Response.json({ success: true, data: userBusinesses });
}
