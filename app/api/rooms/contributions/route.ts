// app/api/rooms/contributions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollectionForDB } from '../../../db';
import { getCurrentUsername } from '../../../lib/session';

export interface ContributionData {
  roomId: string;
  userId: string;
  username: string;
  totalContributed: number;
  totalExpenses: number;
  contributionPercentage: number;
  lastUpdated: Date;
  monthlyContributions: { [month: string]: number };
  categories: {
    groceries: number;
    utilities: number;
    rent: number;
    entertainment: number;
    other: number;
  };
}

// GET - Get contribution data for all room members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      );
    }

    const contributionsCollection = await getCollectionForDB('rooms_database', 'contributions');
    if (!contributionsCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const contributions = await contributionsCollection
      .find({ roomId })
      .toArray();

    // Calculate percentages
    const totalRoomContribution = contributions.reduce((sum, c) => sum + c.totalContributed, 0);
    const contributionsWithPercentages = contributions.map(contrib => ({
      ...contrib,
      contributionPercentage: totalRoomContribution > 0 
        ? (contrib.totalContributed / totalRoomContribution) * 100 
        : 0
    }));

    return NextResponse.json({ contributions: contributionsWithPercentages });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add or update contribution data
export async function POST(request: NextRequest) {
  try {
    const username = getCurrentUsername();
    if (!username) {
      return NextResponse.json(
        { message: 'You must be signed in to update contributions' },
        { status: 401 }
      );
    }

    const { roomId, amount, category, description } = await request.json();

    if (!roomId || !amount || !category) {
      return NextResponse.json(
        { message: 'Room ID, amount, and category are required' },
        { status: 400 }
      );
    }

    const contributionsCollection = await getCollectionForDB('rooms_database', 'contributions');
    if (!contributionsCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const contributionAmount = parseFloat(amount);

    // Check if user already has contribution data for this room
    const existingContribution = await contributionsCollection.findOne({ 
      roomId, 
      username 
    });

    if (existingContribution) {
      // Update existing contribution
      const updateData = {
        $inc: { 
          totalContributed: contributionAmount,
          [`monthlyContributions.${currentMonth}`]: contributionAmount,
          [`categories.${category}`]: contributionAmount
        },
        $set: { lastUpdated: new Date() }
      };

      await contributionsCollection.updateOne(
        { roomId, username },
        updateData
      );
    } else {
      // Create new contribution record
      const newContribution: ContributionData = {
        roomId,
        userId: username,
        username,
        totalContributed: contributionAmount,
        totalExpenses: 0,
        contributionPercentage: 0,
        lastUpdated: new Date(),
        monthlyContributions: {
          [currentMonth]: contributionAmount
        },
        categories: {
          groceries: category === 'groceries' ? contributionAmount : 0,
          utilities: category === 'utilities' ? contributionAmount : 0,
          rent: category === 'rent' ? contributionAmount : 0,
          entertainment: category === 'entertainment' ? contributionAmount : 0,
          other: category === 'other' ? contributionAmount : 0
        }
      };

      await contributionsCollection.insertOne(newContribution);
    }

    return NextResponse.json({ message: 'Contribution recorded successfully' });
  } catch (error) {
    console.error('Error recording contribution:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update contribution percentages (called when room totals change)
export async function PUT(request: NextRequest) {
  try {
    const { roomId } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      );
    }

    const contributionsCollection = await getCollectionForDB('rooms_database', 'contributions');
    if (!contributionsCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const contributions = await contributionsCollection
      .find({ roomId })
      .toArray();

    const totalRoomContribution = contributions.reduce((sum, c) => sum + c.totalContributed, 0);

    // Update percentages for all members
    for (const contrib of contributions) {
      const percentage = totalRoomContribution > 0 
        ? (contrib.totalContributed / totalRoomContribution) * 100 
        : 0;

      await contributionsCollection.updateOne(
        { roomId, username: contrib.username },
        { $set: { contributionPercentage: percentage } }
      );
    }

    return NextResponse.json({ message: 'Contribution percentages updated successfully' });
  } catch (error) {
    console.error('Error updating contribution percentages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
