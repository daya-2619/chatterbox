'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MessageCircle, Shield, Zap, User, Loader2 } from 'lucide-react';

const greetingQuotes = [
  "Connect with friends, share your thoughts, and stay connected with Chatterbox! 💬",
  "Where conversations come alive and friendships flourish! ✨",
  "Your digital space for meaningful conversations and lasting connections! 🌟",
  "Chat, connect, and create memories with Chatterbox! 🚀",
  "Building bridges through conversations, one message at a time! 🌉"
];

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [activeTab, setActiveTab] = useState('signup');
  const { toast } = useToast();
  const { user, login, signup } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  // Rotate quotes every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % greetingQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGmailAuth = async () => {
    setIsLoading(true);
    try {
      // For now, we'll simulate Gmail auth
      // In production, you'd integrate with Google OAuth
      toast({
        title: "Gmail Authentication",
        description: "Gmail integration coming soon! For now, use email/password.",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signup(formData.fullName, formData.username, formData.email, formData.password);
      toast({
        title: "Success!",
        description: "Account created successfully! Welcome to Chatterbox!",
      });
      router.push('/chat');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      toast({
        title: "Welcome Back!",
        description: "Successfully logged in!",
      });
      router.push('/chat');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData({ fullName: '', username: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Chatterbox</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleGmailAuth} disabled={isLoading}>
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "Sign in with Gmail"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Chatterbox
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {greetingQuotes[currentQuote]}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">Real-time Chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700">User Friendly</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setActiveTab('signup')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Chatting Now
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Join Chatterbox
                </CardTitle>
                <p className="text-gray-600">
                  Connect with friends and start chatting today!
                </p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input 
                        id="signup-username" 
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleSignup}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Gmail Button */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGmailAuth}
                  disabled={isLoading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {isLoading ? "Loading..." : "Continue with Gmail"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 Chatterbox. All rights reserved.</p>
      </footer>
    </div>
  );
}
