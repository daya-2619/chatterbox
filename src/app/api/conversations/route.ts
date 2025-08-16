import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      select: 'username avatar isOnline lastSeen'
    })
    .populate({
      path: 'lastMessage',
      select: 'content messageType createdAt'
    })
    .sort({ lastMessageAt: -1 })
    .lean();

    // Format conversations to include other participant info
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        (p: any) => p._id.toString() !== userId
      );
      
      return {
        id: conv._id,
        otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount.get(userId) || 0,
        createdAt: conv.createdAt,
      };
    });

    return NextResponse.json({
      conversations: formattedConversations,
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
