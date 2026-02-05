import nodemailer from 'nodemailer';

export async function sendAdminSignupEmail(adminEmail: string, newUser: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ya tumhare SMTP config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Mauryavansham" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      // to: "akshay.aadrika@gmail.com",
      subject: '🔔 New Signup Request!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>🔔 New signup request!</h3>
          <p><strong>Person you may know:</strong></p>
          <p>
            <b>Name:</b> ${newUser.name}<br>
            <b>Father's Name:</b> ${newUser.fatherName || 'N/A'}<br>
            <b>City:</b> ${newUser.city || 'N/A'}
          </p>
          <p>Please review and approve this account if the person is known to you.</p>
          <p>
            🌐 <a href="https://mauryavansham.com/" target="_blank">Visit Website</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Signup email sent to admin: ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin signup email:', error);
    return false;
  }
}
