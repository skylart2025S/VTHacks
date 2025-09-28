// app/api/rooms/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rooms, roomExists, getRoomById } from '../rooms';
import { getCurrentUsername } from '../../../lib/session';

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

  const exists = roomExists(roomId);
  const room = exists ? getRoomById(roomId) : null;

  return NextResponse.json({ 
    exists,
    room: room ? {
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      createdBy: room.createdBy,
      memberCount: room.members.length
    } : null
  });
}
