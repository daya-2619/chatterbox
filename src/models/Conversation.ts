import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount: { [key: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

// Ensure participants array has unique values
ConversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
