import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from "../../../db";

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
    const usersCollection = await getCollection('users');
    if (!usersCollection) {
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    const cursor = usersCollection.find({});
    const docs = await cursor.toArray();

    const users = docs.map((u: any) => {
      const username = (u.username || '').toString();
      const hash = hashStringToNumber(username);
      const points = (hash % 3000) + 200; // deterministic, 200..3199
      const isOnline = (hash % 2) === 0;
      const lastActive = isOnline ? 'now' : `${(hash % 59) + 1} min ago`;

      return {
        id: u.id || u._id?.toString() || username,
        username: username,
        points,
        isOnline,
        lastActive,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users list:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
