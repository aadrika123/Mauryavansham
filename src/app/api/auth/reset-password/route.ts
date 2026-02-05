import { NextResponse } from 'next/server';
import { db } from '@/src/drizzle/db';
import { users } from '@/src/drizzle/db/schemas/users.schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password in DB
    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
