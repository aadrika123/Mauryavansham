import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/drizzle/db"
import { ads } from "@/src/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [ad] = await db.select().from(ads).where(eq(ads.id, params.id))

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    // Users can only view their own ads unless they're admin
    if (ad.userId !== session.user.id && (session.user.role !== "admin" && session.user.role !== "superAdmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ ad })
  } catch (error) {
    console.error("Error fetching ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    // Check if ad exists
    const [existingAd] = await db.select().from(ads).where(eq(ads.id, params.id))

    if (!existingAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    // Only admin can approve/reject ads
    if ((session.user.role !== "admin" && session.user.role !== "superAdmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const [updatedAd] = await db
      .update(ads)
      .set({
        status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
        approvedAt: status === "approved" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(ads.id, params.id))
      .returning()

    return NextResponse.json({ ad: updatedAd })
  } catch (error) {
    console.error("Error updating ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
