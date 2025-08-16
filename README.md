# 🚀 Chatterbox - Modern Chat Application

A beautiful, feature-rich chat application built with Next.js, MongoDB, and modern web technologies. Connect with friends, share messages, and stay connected in real-time.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure account creation with email/password
- **Gmail Integration**: Sign in with Google (coming soon)
- **Profile Management**: View and edit your profile information
- **Secure Password Hashing**: bcryptjs with 12 salt rounds

### 💬 Chat Functionality
- **Real-time Messaging**: Send and receive messages instantly
- **Conversation Management**: Organize chats with multiple users
- **User Search**: Find and connect with other users
- **Online Status**: See who's online and when they were last active
- **Unread Message Counts**: Track unread messages in conversations

### 🎨 Modern UI/UX
- **Beautiful Landing Page**: Rotating greeting quotes and modern design
- **Responsive Design**: Works perfectly on all devices
- **Gradient Themes**: Beautiful blue-to-purple color schemes
- **Interactive Elements**: Smooth animations and hover effects
- **Toast Notifications**: User-friendly feedback messages

### 🗄️ Database & Backend
- **MongoDB Integration**: Scalable NoSQL database
- **Mongoose ODM**: Type-safe database operations
- **Connection Pooling**: Optimized database performance
- **Data Indexing**: Fast query performance
- **RESTful APIs**: Clean, well-structured endpoints

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: Custom auth context, bcryptjs
- **Database**: MongoDB Atlas (cloud-hosted)
- **Icons**: Lucide React
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd studio-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://chatterbox:8@AKNyAZujt8Lku@cluster0.rtrbhtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=chatterbox_db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9002
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 📱 Usage Guide

### Landing Page
- **Welcome Message**: Beautiful greeting with rotating quotes
- **Sign Up**: Create a new account with full name, username, email, and password
- **Login**: Sign in with existing credentials
- **Gmail Integration**: Quick sign-in with Google (coming soon)

### Chat Interface
- **User Profile**: View your profile information in the sidebar
- **Search Users**: Find and connect with other users
- **Conversations**: View all your chat conversations
- **Send Messages**: Type and send messages in real-time
- **Profile Page**: Access via the user icon in the chat sidebar

### User Management
- **Profile Editing**: Update your full name, username, and email
- **Online Status**: See your current online status
- **Logout**: Securely sign out from the application

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Messaging
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversation` - Get conversation messages

### User Management
- `GET /api/users/search` - Search for users
- `GET /api/conversations` - Get user conversations

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String (required, 2-50 chars),
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6 chars),
  avatar: String (optional),
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  messageType: String (text|image|file|audio),
  isRead: Boolean,
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversations Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId] (ref: User),
  lastMessage: ObjectId (ref: Message),
  lastMessageAt: Date,
  unreadCount: Map,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Backend Testing
```bash
node test-backend.js
```

This will test:
1. User registration
2. User login
3. User search
4. Conversation loading

### Manual Testing
1. **Registration Flow**: Create a new account
2. **Login Flow**: Sign in with credentials
3. **Chat Flow**: Send messages between users
4. **Profile Flow**: View and edit profile information

## 🔒 Security Features

- **Password Security**: 12-round bcrypt hashing
- **Input Validation**: Comprehensive validation on all endpoints
- **Database Security**: Mongoose ODM prevents injection attacks
- **Authentication**: Protected routes and user sessions
- **Data Sanitization**: Clean input/output handling

## 📈 Performance Features

- **Connection Pooling**: MongoDB connections are cached
- **Database Indexes**: Optimized queries for common operations
- **Pagination**: Large datasets are paginated
- **Lean Queries**: Memory-efficient read operations
- **Lazy Loading**: Components load as needed

## 🚧 Future Enhancements

### Immediate Improvements
- [ ] **Real-time Messaging**: WebSocket integration
- [ ] **File Uploads**: Image and file sharing
- [ ] **Push Notifications**: Browser notifications
- [ ] **Message Encryption**: End-to-end encryption

### Advanced Features
- [ ] **Group Chats**: Multi-user conversations
- [ ] **Message Reactions**: Like, heart, etc.
- [ ] **Voice/Video Calls**: Real-time communication
- [ ] **Message Search**: Full-text search in conversations
- [ ] **User Blocking**: Block unwanted users

### Production Features
- [ ] **Rate Limiting**: API request throttling
- [ ] **Logging**: Comprehensive application logging
- [ ] **Monitoring**: Health checks and metrics
- [ ] **Backup**: Automated database backups
- [ ] **SSL**: HTTPS encryption

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify connection string in `.env.local`
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

2. **API Endpoints Not Working**
   - Check if server is running on port 9002
   - Verify API routes are properly configured
   - Check browser console for errors

3. **Authentication Issues**
   - Clear browser localStorage
   - Check if user exists in database
   - Verify password requirements

4. **Build Errors**
   - Clear `.next` folder
   - Reinstall dependencies
   - Check TypeScript compilation

## 📚 Documentation

- **BACKEND_README.md**: Comprehensive backend documentation
- **IMPLEMENTATION_SUMMARY.md**: Complete implementation overview
- **API Examples**: Code samples for all endpoints
- **Database Schema**: Complete data model documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add proper error handling
5. Test all functionality
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **MongoDB**: For the scalable database
- **Tailwind CSS**: For the utility-first CSS framework
- **Radix UI**: For the accessible component primitives

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Made with ❤️ by the Chatterbox Team**

*Connect, chat, and create memories with Chatterbox! 🚀*
