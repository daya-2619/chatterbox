'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Save, X, User, Mail, Calendar, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  if (!user) {
    router.push('/');
    return null;
  }

  const handleEdit = () => {
    setEditData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd make an API call to update the user
      updateUser(editData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/chat')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Chatterbox</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {user.fullName}
                </CardTitle>
                <p className="text-lg text-gray-600">@{user.username}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Profile Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={editData.fullName}
                        onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        {user.fullName}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={editData.username}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        @{user.username}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-3 bg-gray-50 rounded-md border flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-gray-700">
                    {user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Last seen: {new Date(user.lastSeen).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
