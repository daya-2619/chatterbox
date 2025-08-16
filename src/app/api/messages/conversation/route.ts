import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: 'Conversation ID and User ID are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: { $in: conversation.participants } },
        { receiver: userId, sender: { $in: conversation.participants } }
      ]
    })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    // Mark messages as read for the current user
    await Message.updateMany(
      {
        receiver: userId,
        sender: { $in: conversation.participants },
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Update unread count in conversation
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    // Get total count for pagination
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: userId, receiver: { $in: conversation.participants } },
        { receiver: userId, sender: { $in: conversation.participants } }
      ]
    });

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to get chronological order
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: page * limit < totalMessages
      }
    });

  } catch (error) {
    console.error('Get conversation messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
