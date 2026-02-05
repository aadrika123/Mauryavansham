import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { eq, and } from 'drizzle-orm';
import { profileInterests } from '@/src/drizzle/db/schemas/profileInterests';
import nodemailer from 'nodemailer';
import { profiles, users } from '@/src/drizzle/schema';
// GET -> list of users who expressed interest in this profile
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
export async function GET(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> } // yeh receiverProfileId hai
) {
  try {
    const { profileId } = await params;
    if (!profileId) {
      return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });
    }

    // ✅ Fetch all interests where this profile is the receiver
    const interests = await db
      .select()
      .from(profileInterests)
      .where(eq(profileInterests.receiverProfileId, String(profileId)));

    return NextResponse.json({ success: true, interests });
  } catch (error) {
    console.error('Error fetching interests:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}

// POST -> add new interest
export async function POST(req: Request, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const { senderUserId, senderProfileId, receiverUserId, senderProfile } = await req.json();

    if (!profileId || !senderUserId || !senderProfileId || !receiverUserId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // ✅ Save interest
    const inserted = await db.insert(profileInterests).values({
      senderUserId,
      senderProfileId,
      receiverUserId,
      receiverProfileId: profileId,
      senderProfile,
      createdAt: new Date()
    });

    // ✅ Fetch receiver user & profile
    const [receiverUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(receiverUserId)));

    const [receiverProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, Number(profileId)));

    // ✅ Check if mutual interest exists
    const [mutualInterest] = await db
      .select()
      .from(profileInterests)
      .where(
        and(
          eq(profileInterests.senderProfileId, String(profileId)), // receiver expressed first
          eq(profileInterests.receiverProfileId, String(senderProfileId)) // toward sender
        )
      );

    if (mutualInterest) {
      // 🔄 Mutual interest → send emails to both users

      // Fetch sender user & profile
      const [senderUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(senderUserId)));

      const [senderProfileData] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, Number(senderProfileId)));

      // Fetch receiver full profile & user
      const [receiverUserFull] = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(receiverUserId)));

      const [receiverProfileFull] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, Number(profileId)));

      // ✅ Email to original sender
      if (senderUser?.email) {
        await transporter.sendMail({
          from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
          to: senderUser.email,
          subject: 'Your Interest Has Been Accepted!',
          html: `
            <h3>Hello ${senderUser.name || 'User'},</h3>
            <p>
              Good news! The user of profile 
              <b>${receiverProfileFull?.name || 'Unknown'} (${receiverProfileFull?.profileRelation || 'Relation N/A'})</b>
              has expressed back interest in your profile: 
              <b>${senderProfileData?.name || 'Your Profile'} (${senderProfileData?.profileRelation || 'Relation N/A'})</b>.
            </p>
            <p>Contact Details of ${receiverProfileFull?.name}:</p>
            <ul>
              <li><b>Email:</b> ${receiverUserFull?.email}</li>
              <li><b>Phone:</b> ${receiverUserFull?.phone || 'N/A'}</li>
              <li><b>City:</b> ${receiverUserFull?.city || 'N/A'}</li>
              <li><b>State:</b> ${receiverUserFull?.state || 'N/A'}</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}" 
               style="display:inline-block;margin-top:10px;padding:10px 15px;background:#16a34a;color:#fff;text-decoration:none;border-radius:5px;">
               View Mutual Interest
            </a>
            <br/><p>Best regards,<br/>Mauryavansham Team</p>
          `
        });
      }

      // ✅ Email to receiver
      if (receiverUserFull?.email) {
        await transporter.sendMail({
          from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
          to: receiverUserFull.email,
          subject: 'You Have a Mutual Connection!',
          html: `
            <h3>Hello ${receiverUserFull.name || 'User'},</h3>
            <p>
              Good news! You have a mutual connection with profile 
              <b>${senderProfileData?.name} (${senderProfileData?.profileRelation})</b>.
            </p>
            <p>Contact Details of ${senderProfileData?.name}:</p>
            <ul>
              <li><b>Email:</b> ${senderUser?.email}</li>
              <li><b>City:</b> ${senderUser?.city || 'N/A'}</li>
              <li><b>State:</b> ${senderUser?.state || 'N/A'}</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}" 
               style="display:inline-block;margin-top:10px;padding:10px 15px;background:#2563eb;color:#fff;text-decoration:none;border-radius:5px;">
               View Mutual Connection
            </a>
            <br/><p>Best regards,<br/>Mauryavansham Team</p>
          `
        });
      }
    } else {
      // Normal interest → send email to receiver
      if (receiverUser?.email) {
        await transporter.sendMail({
          from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
          to: receiverUser.email,
          subject: 'New Interest Received on Your Profile',
          html: `
            <h3>Hello ${receiverUser.name || 'User'},</h3>
            <p>
              A new interest has been expressed for your profile: 
              <b>${receiverProfile?.name || 'Unknown'} (${receiverProfile?.profileRelation || 'Relation N/A'})</b>.
            </p>
            <p><b>Sender's Profile Details:</b></p>
            <ul>
              <li><b>Name:</b> ${senderProfile.name}</li>
              <li><b>Email:</b> ${senderProfile.email}</li>
              <li><b>City:</b> ${senderProfile.city || 'N/A'}</li>
              <li><b>State:</b> ${senderProfile.state || 'N/A'}</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}" 
               style="display:inline-block;margin-top:10px;padding:10px 15px;background:#2563eb;color:#fff;text-decoration:none;border-radius:5px;">
               View Profiles
            </a>
            <br/><p>Best regards,<br/>Mauryavansham Team</p>
          `
        });
      }
    }

    return NextResponse.json({ success: true, inserted });
  } catch (error) {
    console.error('Error saving interest:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}
