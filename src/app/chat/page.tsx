'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Settings, Search, Send, MessageCircle } from 'lucide-react';

interface User {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherParticipant: User;
  lastMessage?: Message;
  unreadCount: number;
}

export default function ChatPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/conversations?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    
    try {
      const response = await fetch(`/api/users/search?q=${searchQuery}&currentUserId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: conversation.otherParticipant._id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(selectedConversation);
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/messages/conversation?conversationId=${conversationId}&userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    loadMessages(conversationId);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/profile')}>
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Online Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
            <Button onClick={searchUsers} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Search for users to start chatting!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.otherParticipant.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {conversation.otherParticipant.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {conversation.otherParticipant.fullName}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      @{conversation.otherParticipant.username}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    conversation.otherParticipant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.otherParticipant.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {conversations.find(c => c.id === selectedConversation)?.otherParticipant.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {conversations.find(c => c.id === selectedConversation)?.otherParticipant.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{conversations.find(c => c.id === selectedConversation)?.otherParticipant.username} • {
                      conversations.find(c => c.id === selectedConversation)?.otherParticipant.isOnline ? 'Online' : 'Offline'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender._id === user._id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="text-center">Welcome to Chatterbox, {user.fullName}! 👋</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Select a conversation from the sidebar to start chatting, or search for users to start a new conversation.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
