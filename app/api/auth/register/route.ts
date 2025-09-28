// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users } from '../users';
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

    // Check if username already exists
    const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
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
      passwordHash,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Generate unique ID
    };
    users.push(newUser);

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

  const exists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
  return NextResponse.json({ available: !exists });
}