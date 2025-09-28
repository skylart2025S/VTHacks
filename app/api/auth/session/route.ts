import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUsername } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const username = getCurrentUsername();
    return NextResponse.json({ username });
  } catch (error) {
    console.error('Error reading session:', error);
    return NextResponse.json({ username: null }, { status: 500 });
  }
}
