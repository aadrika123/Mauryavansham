import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    const cookieStore = await cookies();
    cookieStore.delete('session-token'); // Delete the session cookie
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
