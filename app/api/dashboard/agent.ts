// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollectionForDB } from '../../db';
import { getSession } from '@/lib/session';
import { ObjectId } from 'mongodb';

const userCollection = await getCollectionForDB('user_database', 'users');
export async function GET(req: NextRequest) {
    const session = getSession();
    if (!session || !session.username) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userCollection) {
        return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    // Use username from session to fetch user
    const user = await userCollection.findOne({ username: session.username });
    console.log('Fetched financial data:', user?.financial_data);

    if (!user || !user.financial_data) {
        return NextResponse.json({ error: 'Financial data not found' }, { status: 404 });
    }

    let financialData;
    try {
        financialData = typeof user.financial_data === 'string'
            ? JSON.parse(user.financial_data)
            : user.financial_data;
    } catch (e) {
        return NextResponse.json({ error: 'Invalid financial data format' }, { status: 500 });
    }

    console.log('Successfully returned financial data for user:', session.username);
    return NextResponse.json({ financial_data: financialData });
}

