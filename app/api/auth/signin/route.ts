// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '../../../db';
import { setSession } from '../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user in the database by username (case-insensitive)
    const usersCollection = await getCollection('users');
    if (!usersCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const user = await usersCollection.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password (password field stores the hashed password)
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

  // Set session (store username lowercase)
  setSession(user.username.toLowerCase());

    // Check if user is already in a room
    let roomInfo = null;
    if (user.roomId) {
      try {
        const { getCollectionForDB } = require('../../../db');
        const roomsCollection = await getCollectionForDB('user_database', 'rooms');
        if (roomsCollection) {
          const room = await roomsCollection.findOne({ id: user.roomId });
          if (room) {
            roomInfo = {
              id: room.id,
              name: room.name,
              createdAt: room.createdAt,
              createdBy: room.createdBy,
              memberCount: room.members ? room.members.length : 0,
              members: room.members || []
            };
          }
        }
      } catch (roomErr) {
        console.error('Failed to fetch room info during sign in:', roomErr);
        // Continue with sign in even if room fetch fails
      }
    }

    // Sign in successful
    return NextResponse.json(
      { 
        message: 'Sign in successful', 
        username: user.username,
        room: roomInfo
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if username exists (for sign in form validation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const usersCollection = await getCollection('users');
  if (!usersCollection) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }

  const exists = await usersCollection.findOne({ username: username.toLowerCase() });
  return NextResponse.json({ exists: !!exists });
}
