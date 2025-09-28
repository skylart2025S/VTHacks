import { NextRequest, NextResponse } from 'next/server';
import { getCollectionForDB } from '../../../db';

function hashStringToNumber(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ message: 'roomId is required', users: [] }, { status: 400 });
    }

    const usersCollection = await getCollectionForDB('user_database', 'users');
    if (!usersCollection) {
      return NextResponse.json({ message: 'Database unavailable', users: [] }, { status: 500 });
    }

    // Only return the raw usernames and id from the database — do not synthesize sample data
    const cursor = usersCollection.find({ roomId: roomId });
    const docs = await cursor.toArray();

    const users = docs.map((u: any) => {
      const username = (u.username || '').toString();
      return {
        id: u._id?.toString() || u.id || username,
        username,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching room members:', error);
    return NextResponse.json({ message: 'Internal server error', users: [] }, { status: 500 });
  }
}
