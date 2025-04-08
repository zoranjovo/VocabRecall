import { createSession } from '@/app/util/session';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  try {
    const { token } = await req.json();

    // attempt to create session with provided token
    const success = await createSession(token);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid authentication token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred during login' }, { status: 500 });
  }
}
