import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const currentUserId = searchParams.get('currentUserId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Build search query
    const searchQuery = {
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        },
        // Exclude current user from search results
        currentUserId ? { _id: { $ne: currentUserId } } : {}
      ]
    };

    // Get users with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(searchQuery)
      .select('username avatar isOnline lastSeen')
      .sort({ username: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: page * limit < totalUsers
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
