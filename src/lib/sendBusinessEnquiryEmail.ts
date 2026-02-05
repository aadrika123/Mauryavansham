// /src/lib/sendBusinessEnquiryEmail.ts
import nodemailer from 'nodemailer';

export async function sendBusinessEnquiryEmail({
  businessOwnerEmail,
  currentUser
}: {
  businessOwnerEmail: string;
  currentUser: any;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
      to: businessOwnerEmail,
      subject: '📩 New Business Enquiry',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p><strong>${currentUser.name}</strong> from ${currentUser.city} ${currentUser.state} (${currentUser.email}) wants to connect with you regarding your registered product.</p>
          <p>🌐 <a href="https://mauryavansham.com/" target="_blank">Visit Website</a></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Business enquiry email sent to ${businessOwnerEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Error sending business enquiry email:', err);
    return false;
  }
}
