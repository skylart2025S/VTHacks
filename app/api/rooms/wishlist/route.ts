// app/api/rooms/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollectionForDB } from '../../../db';
import { getCurrentUsername } from '../../../lib/session';

export interface WishlistItem {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  itemName: string;
  description?: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'purchased' | 'cancelled';
  contributors: string[]; // Array of usernames who want to contribute
  contributionAmounts: { [username: string]: number }; // How much each person wants to contribute
}

// GET - Get wishlist items for a room
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

    const wishlistCollection = await getCollectionForDB('rooms_database', 'wishlist');
    if (!wishlistCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const wishlistItems = await wishlistCollection
      .find({ roomId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new wishlist item
export async function POST(request: NextRequest) {
  try {
    const username = getCurrentUsername();
    if (!username) {
      return NextResponse.json(
        { message: 'You must be signed in to add wishlist items' },
        { status: 401 }
      );
    }

    const { roomId, itemName, description, estimatedCost, priority, category } = await request.json();

    if (!roomId || !itemName || !estimatedCost || !priority || !category) {
      return NextResponse.json(
        { message: 'Room ID, item name, estimated cost, priority, and category are required' },
        { status: 400 }
      );
    }

    const wishlistCollection = await getCollectionForDB('rooms_database', 'wishlist');
    if (!wishlistCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const newItem: WishlistItem = {
      id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      userId: username,
      username,
      itemName,
      description: description || '',
      estimatedCost: parseFloat(estimatedCost),
      priority,
      category,
      createdAt: new Date(),
      status: 'pending',
      contributors: [],
      contributionAmounts: {}
    };

    await wishlistCollection.insertOne(newItem);

    return NextResponse.json(
      { message: 'Wishlist item added successfully', item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update wishlist item (contribute, approve, etc.)
export async function PUT(request: NextRequest) {
  try {
    const username = getCurrentUsername();
    if (!username) {
      return NextResponse.json(
        { message: 'You must be signed in to update wishlist items' },
        { status: 401 }
      );
    }

    const { itemId, action, contributionAmount, status } = await request.json();

    if (!itemId || !action) {
      return NextResponse.json(
        { message: 'Item ID and action are required' },
        { status: 400 }
      );
    }

    const wishlistCollection = await getCollectionForDB('rooms_database', 'wishlist');
    if (!wishlistCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const item = await wishlistCollection.findOne({ id: itemId });
    if (!item) {
      return NextResponse.json(
        { message: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'contribute':
        if (!contributionAmount || contributionAmount <= 0) {
          return NextResponse.json(
            { message: 'Valid contribution amount is required' },
            { status: 400 }
          );
        }
        
        updateData = {
          $addToSet: { contributors: username },
          $set: { [`contributionAmounts.${username}`]: parseFloat(contributionAmount) }
        };
        break;

      case 'uncontribute':
        updateData = {
          $pull: { contributors: username },
          $unset: { [`contributionAmounts.${username}`]: 1 }
        };
        break;

      case 'update_status':
        if (!status) {
          return NextResponse.json(
            { message: 'Status is required for update_status action' },
            { status: 400 }
          );
        }
        updateData = { $set: { status } };
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    await wishlistCollection.updateOne({ id: itemId }, updateData);

    return NextResponse.json({ message: 'Wishlist item updated successfully' });
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove wishlist item
export async function DELETE(request: NextRequest) {
  try {
    const username = getCurrentUsername();
    if (!username) {
      return NextResponse.json(
        { message: 'You must be signed in to delete wishlist items' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const wishlistCollection = await getCollectionForDB('rooms_database', 'wishlist');
    if (!wishlistCollection) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const item = await wishlistCollection.findOne({ id: itemId });
    if (!item) {
      return NextResponse.json(
        { message: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    // Only allow the creator to delete the item
    if (item.username !== username) {
      return NextResponse.json(
        { message: 'You can only delete your own wishlist items' },
        { status: 403 }
      );
    }

    await wishlistCollection.deleteOne({ id: itemId });

    return NextResponse.json({ message: 'Wishlist item deleted successfully' });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
