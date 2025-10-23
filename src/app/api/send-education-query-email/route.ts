import { NextRequest, NextResponse } from "next/server";
import { sendEducationEnquiryEmail } from "@/src/lib/sendEducationEnquiryEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessOwnerEmail, currentUser } = body;

    if (!businessOwnerEmail || !currentUser) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await sendEducationEnquiryEmail({ businessOwnerEmail, currentUser });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending education enquiry email:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
