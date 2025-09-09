import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/drizzle/db";
import { adRates } from "@/src/drizzle/db/schemas/adRates";
import { eq } from "drizzle-orm"; // <-- import eq

// Fetch all rates
export async function GET(req: NextRequest) {
  const rates = await db.select().from(adRates).orderBy(adRates.date);
  return NextResponse.json(rates);
}

// Save / Update rates
export async function POST(req: NextRequest) {
  try {
    const data: { date: string; rate: number }[] = await req.json();

    for (const d of data) {
      const existing = await db
        .select()
        .from(adRates)
        .where(eq(adRates.date, d.date)); // eq imported

      if (existing.length > 0) {
        await db
          .update(adRates)
          .set({ rate: d.rate.toString(), updatedAt: new Date() }) // numeric as string
          .where(eq(adRates.date, d.date));
      } else {
        await db.insert(adRates).values({
          date: d.date, // ✅ already a string in 'YYYY-MM-DD'
          rate: d.rate.toString(), // ✅ convert numeric to string
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save rates" },
      { status: 500 }
    );
  }
}
