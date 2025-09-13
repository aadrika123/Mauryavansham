import { db } from "@/src/drizzle/db";
import { businesses } from "@/src/drizzle/db/schemas/businesses";
import { users } from "@/src/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
// import { db } from "@/db";
// import { businesses, users } from "@/db/schema";

// POST: register business
const businessSchema = z.object({
  userId: z.number().int(),
  organizationName: z.string().min(1),
  organizationType: z.string(),
  businessCategory: z.string(),
  businessDescription: z.string(),
  partners: z.array(z.object({ name: z.string() })).optional(),
  categories: z.array(z.object({ main: z.string(), sub: z.string() })),
  registeredAddress: z.object({
    office: z.string(),
    branch: z.string().optional(),
    location: z.string().optional(),
  }),
  photos: z.object({
    product: z.array(z.string().url()).optional(),
    office: z.array(z.string().url()).optional(),
  }),
  premiumCategory: z.enum(["Platinum", "Gold", "Silver", "General"]),
  paymentStatus: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// POST
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Add default fields
    const dataToInsert = {
      ...body,
      userId: session.user.id, // session se uthaya
      paymentStatus: false,
      isActive: true,
      createdAt: new Date(),
    };

    const inserted = await db
      .insert(businesses)
      .values(dataToInsert)
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET
export async function GET(req: NextRequest) {
  try {
    const businessesWithUser = await db
      .select()
      .from(businesses)
      .innerJoin(users, eq(users.id, businesses.userId));

    return NextResponse.json({ success: true, data: businessesWithUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

