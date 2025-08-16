# Chatterbox Backend Implementation

This document describes the backend implementation for the Chatterbox chat application using Next.js API routes and MongoDB.

## 🗄️ Database Setup

### MongoDB Connection
The application connects to MongoDB using the following connection string:
```
mongodb+srv://chatterbox:8@AKNyAZujt8Lku@cluster0.rtrbhtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Database Name:** `chatterbox_db`

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb+srv://chatterbox:8@AKNyAZujt8Lku@cluster0.rtrbhtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=chatterbox_db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9002
```

## 🏗️ Architecture

### Database Models

#### User Model (`src/models/User.ts`)
- **Fields:** username, email, password, avatar, isOnline, lastSeen
- **Indexes:** username, email, isOnline
- **Features:** Password hashing, online status tracking

#### Message Model (`src/models/Message.ts`)
- **Fields:** sender, receiver, content, messageType, isRead, readAt
- **Indexes:** sender+receiver, createdAt, isRead
- **Features:** Support for text, image, file, and audio messages

#### Conversation Model (`src/models/Conversation.ts`)
- **Fields:** participants, lastMessage, lastMessageAt, unreadCount
- **Indexes:** participants, lastMessageAt
- **Features:** Automatic conversation creation, unread count tracking

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Messaging
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversation` - Get conversation messages

#### Conversations
- `GET /api/conversations` - Get user conversations

#### User Management
- `GET /api/users/search` - Search for users

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install mongodb mongoose bcryptjs @types/bcryptjs
```

### 2. Environment Setup
Copy the environment variables from `env.example` to `.env.local` and update with your values.

### 3. Database Connection
The MongoDB connection is automatically established when the first API request is made. The connection is cached for subsequent requests.

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 🔐 Security Features

- **Password Hashing:** Uses bcryptjs with 12 salt rounds
- **Input Validation:** Comprehensive validation for all API endpoints
- **Authentication Middleware:** Protects routes from unauthorized access
- **MongoDB Injection Protection:** Uses Mongoose for safe database queries

## 📱 API Usage Examples

### Register a New User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});
```

### Send a Message
```javascript
const response = await fetch('/api/messages/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    senderId: 'user_id_1',
    receiverId: 'user_id_2',
    content: 'Hello! How are you?',
    messageType: 'text'
  })
});
```

### Get Conversations
```javascript
const response = await fetch('/api/conversations?userId=current_user_id');
const data = await response.json();
console.log(data.conversations);
```

## 🧪 Testing the Backend

1. **Start the server:** `npm run dev`
2. **Navigate to:** `http://localhost:9002/chat`
3. **Use the chat interface** to test messaging functionality
4. **Check the console** for any error messages

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify your connection string in `.env.local`
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database user has proper permissions

2. **API Endpoints Not Working**
   - Check if the server is running on port 9002
   - Verify the API routes are properly configured
   - Check browser console for CORS errors

3. **Models Not Found**
   - Ensure all model files are in the correct location
   - Check for TypeScript compilation errors
   - Verify import paths are correct

### Database Indexes
The application automatically creates the following indexes for optimal performance:
- User: username, email, isOnline
- Message: sender+receiver, createdAt, isRead
- Conversation: participants, lastMessageAt

## 📈 Performance Considerations

- **Connection Pooling:** MongoDB connections are cached and reused
- **Indexed Queries:** All frequent queries use database indexes
- **Pagination:** Message and user search endpoints support pagination
- **Lean Queries:** Uses `.lean()` for read-only operations to reduce memory usage

## 🔄 Real-time Features

For real-time messaging, consider implementing:
- WebSocket connections using Socket.io
- Server-Sent Events (SSE)
- Polling for message updates

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js/)

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling for new endpoints
3. Include TypeScript interfaces for all data structures
4. Test all API endpoints before submitting changes
5. Update this documentation for any new features
