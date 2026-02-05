// /src/app/api/send-business-enquiry-email/route.ts
import { sendBusinessEnquiryEmail } from '@/src/lib/sendBusinessEnquiryEmail';
import { NextRequest, NextResponse } from 'next/server';
// import { sendBusinessEnquiryEmail } from "@/src/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessOwnerEmail, currentUser } = body;

    if (!businessOwnerEmail || !currentUser) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendBusinessEnquiryEmail({ businessOwnerEmail, currentUser });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending business enquiry email:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
