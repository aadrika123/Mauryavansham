// app/api/debug-email/route.ts
// This is for debugging purposes - disabled in production!

import { NextResponse } from 'next/server';

// Disabled endpoint - returns a message indicating it's disabled
export async function GET() {
  return NextResponse.json({ message: 'Debug email endpoint is disabled' }, { status: 403 });
}

// import { NextRequest, NextResponse } from 'next/server';
// import { sendWelcomeEmail, testEmailConfig } from '@/src/lib/email';

// export async function GET() {
//   try {
//     console.log('🔍 Starting email debug check...');

//     // Test email configuration and capture error details
//     let configValid = false;
//     let configError = null;

//     try {
//       console.log('🧪 Testing SMTP connection...');
//       configValid = await testEmailConfig();
//       console.log('✅ SMTP test result:', configValid);
//     } catch (error) {
//       console.error('❌ SMTP test failed:', error);
//       configError = {
//         message: error.message,
//         code: error.code,
//         command: error.command,
//         responseCode: error.responseCode,
//         response: error.response,
//         stack: error.stack
//       };
//     }

//     // If testEmailConfig returned false but didn't throw, let's test directly
//     if (!configValid && !configError) {
//       try {
//         console.log('🔍 Testing transporter directly...');
//         const nodemailer = require('nodemailer');
//         const testTransporter = nodemailer.createTransport({
//           host: 'smtp.gmail.com',
//           port: 587,
//           secure: false,
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//           },
//           tls: {
//             rejectUnauthorized: false
//           }
//         });

//         await testTransporter.verify();
//         console.log('✅ Direct test passed');
//         configValid = true;
//       } catch (directError) {
//         console.error('❌ Direct test failed:', directError);
//         configError = {
//           message: directError.message,
//           code: directError.code,
//           command: directError.command,
//           responseCode: directError.responseCode,
//           response: directError.response
//         };
//       }
//     }

//     const debugInfo = {
//       timestamp: new Date().toISOString(),
//       environment: process.env.NODE_ENV,
//       emailUser: process.env.EMAIL_USER ? `Set ✅ (${process.env.EMAIL_USER})` : 'Missing ❌',
//       emailPass: process.env.EMAIL_PASS ? `Set ✅ (${process.env.EMAIL_PASS.substring(0, 4)}****)` : 'Missing ❌',
//       nextAuthUrl: process.env.NEXTAUTH_URL ? `Set ✅ (${process.env.NEXTAUTH_URL})` : 'Missing ❌',
//       configurationValid: configValid,
//       configurationError: configError,
//       smtpSettings: {
//         service: 'gmail',
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false
//       }
//     };

//     console.log('📊 Debug info:', debugInfo);

//     return NextResponse.json({
//       message: 'Email debug information',
//       debug: debugInfo,
//     });
//   } catch (error) {
//     console.error('❌ Debug error:', error);
//     return NextResponse.json(
//       { error: 'Debug failed', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { testEmail } = body;

//     if (!testEmail) {
//       return NextResponse.json(
//         { error: 'testEmail is required' },
//         { status: 400 }
//       );
//     }

//     console.log('📧 Testing email send to:', testEmail);

//     // Send test welcome email
//     const result = await sendWelcomeEmail({
//       name: 'Debug Test User',
//       email: testEmail,
//       password: 'TestPassword123',
//     });

//     const response = {
//       success: result.success,
//       messageId: result.messageId,
//       error: result.error,
//       testEmail: testEmail,
//       timestamp: new Date().toISOString(),
//     };

//     console.log('📬 Test email result:', response);

//     if (result.success) {
//       return NextResponse.json({
//         message: 'Test email sent successfully! Check the console logs and your email inbox.',
//         result: response,
//       });
//     } else {
//       return NextResponse.json(
//         {
//           message: 'Test email failed. Check console logs for details.',
//           result: response,
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('❌ Test email error:', error);
//     return NextResponse.json(
//       { error: 'Test email failed', details: error.message },
//       { status: 500 }
//     );
//   }
// }
