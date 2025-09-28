// app/api/rooms/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { roomExists, getRoomById } from '../rooms';
import { getCurrentUsername } from '../../../lib/session';
import { getCollectionForDB } from '../../../db';

export async function POST(request: NextRequest) {
  try {
    const { roomId } = await request.json();

    // Get username from session
    const username = getCurrentUsername();
    
    // Validate input
    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { message: 'You must be signed in to join a room' },
        { status: 401 }
      );
    }

    // Check if room exists
    if (!roomExists(roomId)) {
      return NextResponse.json(
        { message: 'Room not found. Please check the room ID and try again.' },
        { status: 404 }
      );
    }

    // Get the room
    const room = getRoomById(roomId);
    if (!room) {
      return NextResponse.json(
        { message: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const normalizedUsername = username.toLowerCase();
    if (room.members.includes(normalizedUsername)) {
      return NextResponse.json(
        { message: 'You are already a member of this room' },
        { status: 409 }
      );
    }

    // Add user to room
    room.members.push(normalizedUsername);

    // Persist membership change to MongoDB (best-effort)
    try {
      const roomsCollection = await getCollectionForDB('user_database', 'rooms');
      if (roomsCollection) {
        await roomsCollection.updateOne({ id: room.id }, { $addToSet: { members: normalizedUsername } });
      } else {
        console.warn('Rooms DB unavailable: skipping persistent member update');
      }
    } catch (dbErr) {
      console.error('Failed to persist room membership to MongoDB:', dbErr);
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined room', 
        room: {
          id: room.id,
          name: room.name,
          createdAt: room.createdAt,
          createdBy: room.createdBy,
          memberCount: room.members.length,
          members: room.members
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Join room error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if a room exists (for real-time validation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  // First check in-memory store
  let exists = roomExists(roomId);
  let room = exists ? getRoomById(roomId) : null;

  // If not found in-memory, try DB (useful after server restarts where in-memory state is lost)
  if (!room) {
    try {
      const roomsCollection = await getCollectionForDB('rooms_database', 'rooms');
      if (roomsCollection) {
        const doc = await roomsCollection.findOne({ id: roomId });
        if (doc) {
          exists = true;
          room = {
            id: doc.id,
            name: doc.name,
            createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
            createdBy: doc.createdBy,
            members: Array.isArray(doc.members) ? doc.members : [],
          } as any;
        }
      }
    } catch (dbErr) {
      console.error('Error reading room from DB:', dbErr);
    }
  }

  return NextResponse.json({
    exists,
    room: room
      ? {
          id: room.id,
          name: room.name,
          createdAt: room.createdAt,
          createdBy: room.createdBy,
          memberCount: room.members.length,
          members: room.members,
        }
      : null,
  });
}
