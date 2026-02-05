// app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/src/drizzle/db';
import { users } from '@/src/drizzle/db/schemas/users.schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/src/lib/email';

export async function POST(request: NextRequest) {
  console.log('📩 [SIGNUP API] POST request received');

  try {
    const body = await request.json();
    console.log('📦 [SIGNUP API] Request body:', body);

    const { name, email, password, phone } = body;

    // Validation
    if (!name || !email || !password) {
      console.warn('⚠️ [SIGNUP API] Missing required fields');
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      console.warn('⚠️ [SIGNUP API] Weak password');
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    console.log('🔍 [SIGNUP API] Checking if user exists:', email);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      console.warn('⚠️ [SIGNUP API] User already exists:', email);
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    console.log('🔑 [SIGNUP API] Hashing password...');
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log('📝 [SIGNUP API] Inserting user into database...');
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        phone: phone || null
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      });

    console.log('✅ [SIGNUP API] User created:', newUser[0]);

    // Send welcome email
    console.log('📧 [SIGNUP API] Calling sendWelcomeEmail...');
    const emailResult = await sendWelcomeEmail({
      name: newUser[0].name,
      email: newUser[0].email,
      password: password
    });

    console.log('📬 [SIGNUP API] Email send result:', emailResult);

    if (!emailResult.success) {
      console.error('🚨 [SIGNUP API] Failed to send welcome email:', emailResult.error);
    } else {
      console.log('✅ [SIGNUP API] Welcome email sent successfully!');
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser[0],
        emailSent: emailResult.success
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('💥 [SIGNUP API] Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
