import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq, and } from 'drizzle-orm';
import { users, userApprovals } from '@/src/drizzle/schema';
import nodemailer from 'nodemailer';

const REQUIRED_APPROVALS = 3;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    const { adminId, adminName } = await req.json();

    // 1️⃣ Check if this admin already acted
    const existing = await db.query.userApprovals.findFirst({
      where: (ua) => and(eq(ua.userId, userId), eq(ua.adminId, adminId))
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'You have already approved this user.'
      });
    }

    // 2️⃣ Insert new approval
    await db.insert(userApprovals).values({
      userId,
      adminId,
      adminName,
      status: 'approved'
    });

    // 3️⃣ Recalculate approvals
    const approvals = await db.query.userApprovals.findMany({
      where: (ua) => eq(ua.userId, userId)
    });

    const approvedCount = approvals.filter(
      (a) => a.status === 'approved'
    ).length;
    const rejectedCount = approvals.filter(
      (a) => a.status === 'rejected'
    ).length;

    let newStatus: 'pending' | 'approved' | 'rejected' = 'pending';
    let isApproved = false;

    if (rejectedCount > 0) {
      newStatus = 'rejected';
      isApproved = false;
    } else if (approvedCount >= REQUIRED_APPROVALS) {
      newStatus = 'approved';
      isApproved = true;
    }

    await db
      .update(users)
      .set({ status: newStatus, isApproved })
      .where(eq(users.id, userId));

    // 4️⃣ Fetch user email & name
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user?.email) {
      return NextResponse.json({
        success: true,
        message: 'User approved (no email found).'
      });
    }

    // 5️⃣ Determine email content based on approval count
    let subject = '';
    let html = '';
    const approvedByAdmin = adminName;

    if (approvedCount === 1) {
      subject =
        'Your www.mauryavansham.com Registration – First Step Completed ✅';
      html = `
        <p>Dear ${user.name},</p>
        <p>We are pleased to inform you that your registration on <b>www.mauryavansham.com</b> has successfully received its <b>first approval</b> from an Admin Member.</p>
        <p>As per our community guidelines, your profile must be verified and approved by <b>three (3) Admin Members</b> before it is activated.</p>
        <p>Status Update:<br/>
          ✔ Approved by: ${approvedByAdmin}<br/>
          ⏳ Pending: 2 Admin approvals
        </p>
        <p>You will receive further updates as soon as additional approvals are granted.</p>
        <p>Warm regards,<br/>www.mauryavansham.com Team<br/>(Designed & Hosted by Aadrika Enterprises – A Community Development Initiative)</p>
      `;
    } else if (approvedCount === 2) {
      subject = 'Your www.mauryavansham.com Registration – Almost There 🎉';
      html = `
        <p>Dear ${user.name},</p>
        <p>Good news! Your registration on <b>www.mauryavansham.com</b> has now received <b>two (2) Admin approvals</b>.</p>
        <p>Only <b>one final approval</b> remains before your account is fully activated.</p>
        <p>Status Update:<br/>
          ✔ Approved by: ${approvedByAdmin}<br/>
          ⏳ Pending: 1 Admin approval
        </p>
        <p>You will be notified immediately once the verification process is complete.</p>
        <p>Warm regards,<br/>www.mauryavansham.com Team<br/>(Designed & Hosted by Aadrika Enterprises – A Community Development Initiative)</p>
      `;
    } else if (approvedCount >= 3) {
      subject =
        'Welcome to www.mauryavansham.com – Your Profile is Now Active 🌟';
      html = `
       <p>Dear ${user.name},</p>
    <p>Congratulations and welcome aboard! 🎊</p>
    <p>Your registration on <b>www.mauryavansham.com</b> has successfully received approvals from all three (3) Admin Members. Latest approval by Admin: <b>${approvedByAdmin}</b></p>
    <p>Your account is now <b>fully verified and active</b>.</p>
    <p>You can now:</p>
    <ul>
      <li>Explore the Community Directory and connect with fellow members</li>
      <li>List and discover opportunities in the Business Directory</li>
      <li>Participate in the Matrimonial Section</li>
      <li>Engage in community events, peer-to-peer support, and much more</li>
    </ul>
    <p>We are delighted to have you as part of this initiative dedicated to the growth and unity of the Kushwaha / Koiri / Maurya / Sakhya / Sainy community.</p>
    <p>Warm regards,<br/>www.mauryavansham.com Team<br/>(Designed & Hosted by Aadrika Enterprises – A Community Development Initiative)</p>
  `;
    }

    // 6️⃣ Send email
    if (subject && html) {
      await transporter.sendMail({
        from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User approval recorded and email sent.'
    });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    );
  }
}
