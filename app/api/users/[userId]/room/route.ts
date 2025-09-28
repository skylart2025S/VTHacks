// app/api/users/[userId]/room/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollectionForDB } from '../../../../db';
import { getCurrentUsername } from '../../../../lib/session';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params Promise to get the actual parameters
    const { userId } = await context.params;
    
    // Get current username from session for verification
    const currentUsername = getCurrentUsername();
    
    if (!currentUsername) {
      return NextResponse.json(
        { message: 'You must be signed in to check room membership' },
        { status: 401 }
      );
    }

    // Verify the user is checking their own room membership
    if (currentUsername.toLowerCase() !== userId.toLowerCase()) {
      return NextResponse.json(
        { message: 'You can only check your own room membership' },
        { status: 403 }
      );
    }

    // Get user's roomId from the users collection
    const usersCollection = await getCollectionForDB('user_database', 'users');
    if (!usersCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const user = await usersCollection.findOne({ username: userId.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If user has a roomId, get the room details
    if (user.roomId) {
      const roomsCollection = await getCollectionForDB('user_database', 'rooms');
      if (roomsCollection) {
        const room = await roomsCollection.findOne({ id: user.roomId });
        
        if (room) {
          return NextResponse.json({
            hasRoom: true,
            room: {
              id: room.id,
              name: room.name,
              createdAt: room.createdAt,
              createdBy: room.createdBy,
              memberCount: room.members ? room.members.length : 0,
              members: room.members || []
            }
          });
        }
      }
    }

    // User is not in any room
    return NextResponse.json({
      hasRoom: false,
      room: null
    });

  } catch (error) {
    console.error('Error checking user room membership:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}