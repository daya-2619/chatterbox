import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content, messageType = 'text' } = await request.json();

    // Validate input
    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Sender ID, receiver ID, and content are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: 'Invalid sender or receiver ID' },
        { status: 404 }
      );
    }

    // Create or find conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        unreadCount: { [receiverId.toString()]: 0 }
      });
    }

    // Create message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType,
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    conversation.unreadCount.set(receiverId.toString(), 
      (conversation.unreadCount.get(receiverId.toString()) || 0) + 1
    );
    await conversation.save();

    // Populate sender and receiver details
    await message.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'receiver', select: 'username avatar' }
    ]);

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message,
    }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
