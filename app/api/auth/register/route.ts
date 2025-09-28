// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection, getCollectionForDB } from '../../../db';
import { setSession } from '@/lib/session';
export async function POST(request: NextRequest) {
  try {
  const { username, password, roomId } = await request.json();
  const trimmedRoomId = typeof roomId === 'string' ? roomId.trim() : '';

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if usersCollection is available
    const usersCollection = await getCollection('users');
    if (!usersCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const existingUser = await usersCollection.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exists. Please choose a different username.' },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Store the user (in production, save to database)
    const newUser = {
      username: username.toLowerCase(),
      password: passwordHash,
      roomId: trimmedRoomId || '',
      financial_data: {}, // Start with empty financial data - will be populated with unique data
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}` // Generate unique ID
    };
    await usersCollection.insertOne(newUser);

      // If the client requested a room to be created/added, store it in the rooms DB
      if (trimmedRoomId) {
        try {
          // Prefer the dedicated rooms database for room membership persistence
          const roomsCollection = await getCollectionForDB('user_database', 'rooms');
          const normalizedUsername = newUser.username.toLowerCase();

          if (roomsCollection) {
            // Try to add the user to an existing room's members array
            const updateResult = await roomsCollection.updateOne(
              { id: roomId },
              { $addToSet: { members: normalizedUsername } }
            );

            // If the room did not exist in DB, create it (best-effort)
            if (updateResult.matchedCount === 0) {
              const roomDoc = {
                id: trimmedRoomId,
                createdAt: new Date(),
                creator: newUser.username,
                members: [normalizedUsername]
              };
              await roomsCollection.insertOne(roomDoc);
            }

            // attach roomId to user document
            await usersCollection.updateOne({ id: newUser.id }, { $set: { roomId: trimmedRoomId } });
          } else {
            console.warn('Rooms DB connection not available; skipping room membership update');
            // still attach roomId to user document locally
            await usersCollection.updateOne({ id: newUser.id }, { $set: { roomId: trimmedRoomId } });
          }
        } catch (roomErr) {
          console.error('Error updating room membership:', roomErr);
          // attempt to still attach roomId to user document
          try {
            await usersCollection.updateOne({ id: newUser.id }, { $set: { roomId: trimmedRoomId } });
          } catch (attachErr) {
            console.error('Failed to set roomId on user after room update error:', attachErr);
          }
        }
      }

    // Set session
    setSession(username.toLowerCase());

    // Generate unique financial data for the new user
    try {
      console.log(`🔄 Generating financial data for new user: ${newUser.id}`);
      
      // Call the financial data generation endpoint
      const financialDataResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/${newUser.id}/financial-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (financialDataResponse.ok) {
        const financialData = await financialDataResponse.json();
        console.log(`✅ Financial data generated for user ${newUser.id}`);
        
        // Update the user's financial_data in the database with the unique data
        await usersCollection.updateOne(
          { id: newUser.id },
          { $set: { financial_data: financialData.data } }
        );
        
        return NextResponse.json(
          { 
            message: 'Account created successfully with financial data', 
            username,
            userId: newUser.id,
            financialDataGenerated: true,
            financialData: financialData.data
          },
          { status: 201 }
        );
      } else {
        console.warn(`⚠️ Failed to generate financial data for user ${newUser.id}`);
        
        return NextResponse.json(
          { 
            message: 'Account created successfully (financial data generation failed)', 
            username,
            userId: newUser.id,
            financialDataGenerated: false
          },
          { status: 201 }
        );
      }
    } catch (financialError) {
      console.error('Error generating financial data:', financialError);
      
      return NextResponse.json(
        { 
          message: 'Account created successfully (financial data generation failed)', 
          username,
          userId: newUser.id,
          financialDataGenerated: false
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if username exists (for real-time validation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const usersCollection = await getCollection('users');
  if (!usersCollection) {
    return NextResponse.json({ available: false }, { status: 500 });
  }
  const exists = await usersCollection.findOne({ username: username.toLowerCase() });
  return NextResponse.json({ available: !exists });
}