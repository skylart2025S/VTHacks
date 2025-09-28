// app/api/rooms/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rooms, generateRoomId, Room } from '../rooms';
import { getCurrentUsername } from '../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const { roomName } = await request.json();

    // Get username from session
    const createdBy = getCurrentUsername();

    // Validate input
    if (!roomName) {
      return NextResponse.json(
        { message: 'Room name is required' },
        { status: 400 }
      );
    }

    if (!createdBy) {
      return NextResponse.json(
        { message: 'You must be signed in to create a room' },
        { status: 401 }
      );
    }

    if (roomName.length < 3) {
      return NextResponse.json(
        { message: 'Room name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Generate unique room ID
    const roomId = generateRoomId();

    // Create new room
    const newRoom: Room = {
      id: roomId,
      name: roomName,
      createdAt: new Date(),
      createdBy: createdBy.toLowerCase(),
      members: [createdBy.toLowerCase()]
    };

    // Store the room
    rooms.push(newRoom);

    return NextResponse.json(
      { 
        message: 'Room created successfully', 
        room: {
          id: newRoom.id,
          name: newRoom.name,
          createdAt: newRoom.createdAt,
          createdBy: newRoom.createdBy,
          memberCount: newRoom.members.length
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to list all rooms (for debugging/admin purposes)
export async function GET() {
  try {
    const roomList = rooms.map(room => ({
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      createdBy: room.createdBy,
      memberCount: room.members.length
    }));

    return NextResponse.json({ rooms: roomList });
  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
