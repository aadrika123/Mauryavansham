// lib/email.ts
import nodemailer from "nodemailer";

console.log("📦 Loading email module...");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT ?? 587),
  secure: false, // true for 465, false for other ports
  auth: {
    // user: "akshay.aadrika@gmail.com",
    // pass: "ohonapfqewlrjshn",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // Nodemailer internal debug
  logger: true, // Logs to console
});

export interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
}

// Beautiful HTML template for Mauryavansh community
const createHtmlContent = (name: string, email: string, password: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Mauryavansh Community</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #FF6B35, #F7931E, #FFD700);
            min-height: 100vh;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #8B0000, #DC143C, #FF6B35);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(45deg, #8B0000, #B22222);
            padding: 30px 20px;
            text-align: center;
            position: relative;
            border-bottom: 3px solid #FFD700;
        }
        .crown-icon {
            font-size: 48px;
            color: #FFD700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .logo-text {
            color: #FFD700;
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-family: 'Georgia', serif;
        }
        .subtitle {
            color: #FFFFFF;
            font-size: 16px;
            margin: 5px 0;
            opacity: 0.9;
        }
        .content {
            background: linear-gradient(135deg, #FFFFFF, #FFF8DC);
            padding: 40px 30px;
            color: #333;
        }
        .welcome-title {
            color: #8B0000;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .greeting {
            font-size: 18px;
            color: #2C1810;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .success-message {
            background: linear-gradient(45deg, #E8F5E8, #D4F1D4);
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .success-icon {
            color: #4CAF50;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .credentials-box {
            background: linear-gradient(135deg, #8B0000, #A0522D);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border: 2px solid #FFD700;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .credentials-title {
            color: #FFD700;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .credential-item {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
        }
        .credential-label {
            font-weight: bold;
            color: #FFD700;
            display: inline-block;
            width: 80px;
        }
        .credential-value {
            color: #FFFFFF;
            font-family: 'Courier New', monospace;
            background: rgba(0,0,0,0.2);
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
        }
        .cta-button {
            background: linear-gradient(45deg, #FF6B35, #F7931E);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 18px;
            display: inline-block;
            margin: 25px auto;
            text-align: center;
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
            transition: all 0.3s ease;
            border: 2px solid #FFD700;
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer {
            background: linear-gradient(45deg, #8B0000, #B22222);
            color: white;
            text-align: center;
            padding: 25px;
            border-top: 3px solid #FFD700;
        }
        .footer-crown {
            color: #FFD700;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .website-link {
            color: #FFD700;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
        }
        .decorative-border {
            height: 4px;
            background: linear-gradient(90deg, #FFD700, #FF6B35, #8B0000, #FF6B35, #FFD700);
            margin: 20px 0;
        }
        .community-message {
            background: linear-gradient(45deg, #FFF8DC, #FFEBCD);
            border: 2px solid #D2691E;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            color: #8B4513;
        }
        .heritage-text {
            color: #8B0000;
            font-style: italic;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="crown-icon">👑</div>
            <div class="logo-text">Mauryavansh</div>
            <div class="subtitle">मौर्यवंश - गौरवशाली परम्परा</div>
        </div>
        
        <div class="content">
            <h1 class="welcome-title">🏛️ Welcome to Mauryavansh Community! 🏛️</h1>
            
            <div class="greeting">
                Namaste <strong>${name}</strong>,
            </div>
            
            <div class="success-message">
                <div class="success-icon">✅</div>
                <strong>Congratulations! Your account has been created successfully.</strong>
            </div>
            
            <div class="community-message">
                <p class="heritage-text">
                    Welcome to the distinguished Mauryavansh community! You are now connected to a proud legacy that honors the great Mauryan heritage. Join us in celebrating our cultural traditions and building meaningful connections with fellow community members across the globe.
                </p>
            </div>
            
            <div class="decorative-border"></div>
            
            <div class="credentials-box">
                <div class="credentials-title">🔐 Your Login Credentials</div>
                <div class="credential-item">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">${email}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${password}</span>
                </div>
            </div>
            
            <div class="cta-container">
                <a href="${process.env.NEXTAUTH_URL}/sign-in" class="cta-button">
                    🚀 Access Your Account Now
                </a>
            </div>
            
            <div class="decorative-border"></div>
            
            <p style="text-align: center; color: #666; margin-top: 30px;">
                <em>Please keep your credentials secure. We're honored to have you in the Mauryavansh community!</em>
            </p>
        </div>
        
        <div class="footer">
            <div class="footer-crown">👑</div>
            <p>Explore our community platform:</p>
            <a href="https://mauryavansham.com" class="website-link">mauryavansham.com</a>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                © 2025 Mauryavansh Community. Honoring our heritage, strengthening our bonds.
            </p>
        </div>
    </div>
</body>
</html>
`;

// Text content for email clients that don't support HTML
const createTextContent = (name: string, email: string, password: string) => `
👑 MAURYAVANSH COMMUNITY 👑
मौर्यवंश - गौरवशाली परम्परा

Welcome to Mauryavansh Community!

Namaste ${name},

Congratulations! Your account has been created successfully.

Welcome to the distinguished Mauryavansh community! You are now connected to a proud legacy that honors the great Mauryan heritage.

🔐 YOUR LOGIN CREDENTIALS:
Email: ${email}
Password: ${password}

🚀 Access your account at: ${process.env.NEXTAUTH_URL}/sign-in

Explore our community: https://mauryavansham.com

Please keep your credentials secure. We're honored to have you in the Mauryavansh community!

© 2025 Mauryavansh Community
Honoring our heritage, strengthening our bonds.
`;

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  console.log("\n🚀 === EMAIL SEND START ===");
  console.log("📧 Data received:", data);

  // Check environment variables
  console.log("🔧 ENV Check:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
  console.log(
    "NEXTAUTH_URL:",
    process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing"
  );

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Missing email credentials in environment variables");
    return { success: false, error: "Missing email credentials" };
  }

  try {
    console.log("📝 Creating beautiful email content...");
    const { name, email, password } = data;

    // Use the beautiful templates
    const htmlContent = createHtmlContent(name, email, password);
    const textContent = createTextContent(name, email, password);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "👑 Mauryavansh Community - Your Account is Successfully Created!",
      text: textContent,
      html: htmlContent,
    };

    console.log("🔄 Attempting to send beautiful email to:", email);
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Beautiful email sent!");
    console.log("📨 Message ID:", info.messageId);
    console.log("📤 Response:", info.response);
    console.log("=== EMAIL SEND END ===\n");

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("💥 Error sending welcome email:");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Full error object:", error);
    } else {
      console.error("💥 Unknown error:", error);
    }
    return { success: false, error };
  }
};

export const testEmailConfig = async () => {
  console.log("\n🧪 === TEST EMAIL CONFIG START ===");
  console.log("📧 SMTP Config Check:", {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: process.env.EMAIL_USER ? "✅ Set" : "❌ Missing",
    pass: process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing",
  });

  try {
    console.log("🔍 Verifying SMTP connection...");
    const result = await transporter.verify();
    console.log("✅ SMTP connection successful:", result);
    console.log("=== TEST EMAIL CONFIG END ===\n");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ SMTP connection failed:", error.message);
    } else {
      console.error("❌ Unknown SMTP connection error:", error);
    }
    throw error;
  }
};