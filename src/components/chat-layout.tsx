"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { 
  Search, 
  Video, 
  Smile, 
  Paperclip, 
  Send,
  Check,
  CheckCheck,
  Edit,
  Mail,
  MoreVertical,
  Phone,
  PhoneOff,
  MicOff,
  VideoOff,
  PlusCircle,
  FileText,
  Image as ImageIcon,
  Music,
  X,
  Menu,
  Wallpaper,
} from 'lucide-react';
import { type Chat, type User, type Message } from '@/types';
import { cn } from '@/lib/utils';
import UserAvatar from './user-avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface ChatLayoutProps {
  chats: Chat[];
  loggedInUser: User;
}

const ClientTime = ({ timestamp }: { timestamp: string }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
  }, [timestamp]);

  return <>{time}</>;
}


const RightSidebar = ({user, chat, onClose, onAttachmentClick, onWallpaperChange}: {user: User | null, chat: Chat | null, onClose: () => void, onAttachmentClick: (type: Message['type'] | 'all') => void, onWallpaperChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
    const wallpaperInputRef = useRef<HTMLInputElement>(null);

    const getMediaMessages = (mediaType: Message['type']) => {
        if (!chat) return [];
        return chat.messages.filter(msg => msg.type === mediaType);
    };

    return (
        <div className="w-full bg-card flex flex-col p-4 sm:p-6 border-l h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Contact Info</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                    <X/>
                </Button>
            </div>
            {user ? (
                <ScrollArea className='flex-1'>
                    <div className="flex flex-col items-center text-center">
                        <UserAvatar user={user} className="h-24 w-24 mb-4" />
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.isOnline ? 'Online' : 'Offline'}</p>
                    </div>
                    <Separator className="my-6"/>
                    <div className='space-y-4'>
                      <div>
                        <h3 className="font-semibold mb-2 text-muted-foreground">About</h3>
                        <p className="text-sm">{user.about}</p>
                      </div>
                       <div>
                        <h3 className="font-semibold mb-2 text-muted-foreground">Email</h3>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground"/>
                            <p className="text-sm break-all">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6"/>
                    <div>
                        <h3 className="font-semibold mb-4 text-muted-foreground">Customization</h3>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={wallpaperInputRef}
                            onChange={onWallpaperChange}
                        />
                         <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => wallpaperInputRef.current?.click()}
                        >
                            <Wallpaper className="mr-2 h-4 w-4" />
                            Change Wallpaper
                        </Button>
                    </div>
                    <Separator className="my-6"/>
                    <div>
                        <h3 className="font-semibold mb-4 text-muted-foreground">Attachments</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => onAttachmentClick('image')} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-left">
                                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-md"><ImageIcon className="h-5 w-5"/></div>
                                <div>
                                    <span className="text-sm font-semibold">Images</span>
                                    <p className='text-xs text-muted-foreground'>{getMediaMessages('image').length} files</p>
                                </div>
                            </button>
                            <button onClick={() => onAttachmentClick('video')} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-left">
                                <div className="bg-green-100 text-green-600 p-2 rounded-md"><Video className="h-5 w-5"/></div>
                                 <div>
                                    <span className="text-sm font-semibold">Videos</span>
                                    <p className='text-xs text-muted-foreground'>{getMediaMessages('video').length} files</p>
                                </div>
                            </button>
                            <button onClick={() => onAttachmentClick('audio')} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-left">
                                <div className="bg-purple-100 text-purple-600 p-2 rounded-md"><Music className="h-5 w-5"/></div>
                                 <div>
                                    <span className="text-sm font-semibold">Audio</span>
                                    <p className='text-xs text-muted-foreground'>{getMediaMessages('audio').length} files</p>
                                </div>
                            </button>
                             <button onClick={() => onAttachmentClick('file')} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-left">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-md"><FileText className="h-5 w-5"/></div>
                                 <div>
                                    <span className="text-sm font-semibold">Files</span>
                                    <p className='text-xs text-muted-foreground'>{getMediaMessages('file').length} files</p>
                                </div>
                            </button>
                        </div>
                        <Button variant="outline" className="w-full mt-4" onClick={() => onAttachmentClick('all')}>View All</Button>
                    </div>
                </ScrollArea>
            ) : (
                <div className="flex h-full flex-col items-center justify-center text-muted-foreground text-center">
                    <p>Select a chat to see contact info</p>
                </div>
            )}
        </div>
      );
}

const AttachmentsViewer = ({ chat, filter, onImageClick }: { chat: Chat | null, filter: Message['type'] | 'all', onImageClick: (url: string) => void }) => {
    if (!chat) return null;

    const tabs: (Message['type'] | 'all')[] = ['all', 'image', 'video', 'audio', 'file'];
    const [activeTab, setActiveTab] = useState(filter === 'all' ? 'image' : filter);
    
    const getFilteredMessages = (type: Message['type']) => chat.messages.filter(m => m.type === type);

    const renderMedia = (type: Message['type']) => {
      const messages = getFilteredMessages(type);
      if (messages.length === 0) {
        return <div className="text-center text-muted-foreground py-10">No {type}s found.</div>;
      }
      if (type === 'image') {
        return (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {messages.map(msg => (
              <img
                key={msg.id}
                src={msg.content}
                alt="attachment"
                data-ai-hint="chat attachment"
                className="w-full h-24 object-cover rounded-md cursor-pointer"
                onClick={() => onImageClick(msg.content)}
              />
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
               <div className="bg-blue-100 text-blue-600 p-2 rounded-md"><FileText className="h-6 w-6" /></div>
               <div className="flex-1">
                 <p className="font-semibold break-all">{msg.content}</p>
                 <a href="#" className="text-xs text-primary hover:underline">Download</a>
               </div>
            </div>
          ))}
        </div>
      );
    }

    return (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="file">Files</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-80">
                <div className="p-4">
                  <TabsContent value="image">{renderMedia('image')}</TabsContent>
                  <TabsContent value="video">{renderMedia('video')}</TabsContent>
                  <TabsContent value="audio">{renderMedia('audio')}</TabsContent>
                  <TabsContent value="file">{renderMedia('file')}</TabsContent>
                </div>
            </ScrollArea>
        </Tabs>
    )
}

export default function ChatLayout({ chats: initialChats, loggedInUser: initialUser }: ChatLayoutProps) {
  const [chats, setChats] = useState(initialChats);
  const [loggedInUser, setLoggedInUser] = useState(initialUser);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState("");
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isVidCallDialogOpen, setIsVidCallDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [messageContent, setMessageContent] = useState("");
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [viewedImage, setViewedImage] = useState<string | null>(null);
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [isAttachmentsDialogOpen, setIsAttachmentsDialogOpen] = useState(false);
  const [attachmentFilter, setAttachmentFilter] = useState<Message['type'] | 'all'>('all');
  
  const [profileData, setProfileData] = useState({
      name: initialUser.name,
      about: initialUser.about,
      avatarUrl: initialUser.avatarUrl,
  });

  useEffect(() => {
    setIsMounted(true);
    if (chats.length > 0) {
      const sortedChats = [...chats].sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1]?.timestamp || 0;
        const lastMessageB = b.messages[b.messages.length - 1]?.timestamp || 0;
        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
      });
      setChats(sortedChats);
      setSelectedChat(sortedChats[0]);
    }
  }, []);
  
  useEffect(() => {
    if (selectedChat) {
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedChat?.messages]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages, isTyping]);
  
  useEffect(() => {
    const getCameraPermission = async () => {
        if (!isVidCallDialogOpen) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isVidCallDialogOpen, toast]);


  const getParticipant = (chat: Chat) => {
    if (chat.type === 'private') {
      return chat.participants.find(p => p.id !== loggedInUser.id)!;
    }
    return null;
  };
  
  const handleSendMessage = (content: string, type: Message['type'] = 'text') => {
    if (content && selectedChat) {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            sender: loggedInUser,
            content: content,
            timestamp: new Date().toISOString(),
            status: getParticipant(selectedChat)?.isOnline ? 'delivered' : 'sent',
            type,
        };
        
        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, newMessage],
        };

        setSelectedChat(updatedChat);

        const updatedChats = chats.map(chat => 
            chat.id === selectedChat.id ? updatedChat : chat
        );
        setChats(updatedChats);
        
        if (type === 'text') {
            setMessageContent('');
        }

        setIsTyping(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (messageContent.trim()) {
        handleSendMessage(messageContent, 'text');
      }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendMessage(file.name, 'file');
    }
    e.target.value = ''; // Reset input
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleSendMessage(event.target?.result as string, 'image');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };
  
  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newWallpaper = event.target?.result as string;
        const updatedChat = { ...selectedChat, wallpaper: newWallpaper };
        
        const updatedChats = chats.map(chat =>
          chat.id === selectedChat.id ? updatedChat : chat
        );
        setChats(updatedChats);
        setSelectedChat(updatedChat);

        toast({
          title: "Wallpaper Updated",
          description: "Your chat wallpaper has been successfully changed.",
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleEmojiClick = (emoji: string) => {
      setMessageContent(prev => prev + emoji);
  }
  
  const handleProfileSave = () => {
    const updatedUser = { ...loggedInUser, ...profileData };
    setLoggedInUser(updatedUser);
    
    const updatedChats = chats.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => p.id === updatedUser.id ? updatedUser : p)
    }));
    setChats(updatedChats);

    setIsProfileDialogOpen(false);
    toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
    })
  };

  const handleAttachmentClick = (type: Message['type'] | 'all') => {
      setAttachmentFilter(type);
      setIsAttachmentsDialogOpen(true);
  }

  const filteredChats = chats.filter(chat => {
    if (chat.type === 'group') {
      return chat.name?.toLowerCase().includes(sidebarSearchTerm.toLowerCase());
    }
    const participant = getParticipant(chat);
    return participant?.name.toLowerCase().includes(sidebarSearchTerm.toLowerCase());
  });

  const getMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'seen':
        return <CheckCheck size={16} className="text-blue-500" />;
      case 'delivered':
        return <CheckCheck size={16} />;
      case 'sent':
        return <Check size={16} />;
      default:
        return null;
    }
  };

  const filteredMessages = selectedChat?.messages.filter(message => 
    message.content.toLowerCase().includes(chatSearchTerm.toLowerCase())
  );
  
  const mainContainerStyle = selectedChat?.wallpaper ? {
    backgroundImage: `url(${selectedChat.wallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  if (!isMounted) {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="h-16 w-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  const emojis = ['😀','😃','😄','😁','😆','🥹','😅','😂','🤣','🥲','☺️','😙','😗','😘','🥰','😍','😌','😉','🙃','🙂','😇','😊','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🙁','😕','😟','😔','😞','🙂‍↔️','😒','😏','🙂‍↕️','🥳','🤩','☹️','😣','😖','😩','🥺','😢','😭','😤','😠','😡','😓','😥','😰','😨','😱','😶‍🌫️','🥶','🥵','😳','🤯','🤬','🤗','🤔','🤭','🫣','🫢','🫡','🤫','🫠','🤥','😶','🫥','😲','😮','😧','😦','😯','🙄','😬','😑','🫨','🫤','😐','🥱','😴','🤤','😪','😮‍💨','😵','😵‍💫','🤐','🥴','🤢','🤮','🤡','👹','👺','👿','😈','🤑','🤠','🤕','🤒','😷','🤧','🫶🏻','🤝','👍🏻','👎🏻','👊🏻','🫳🏻','🫴🏻','🤌🏻','🙏🏻','🫂'];

  return (
    <div className="h-screen w-full flex bg-card overflow-hidden">
        <div className={cn(
            "h-full w-full sm:w-96 flex-shrink-0 bg-sidebar border-r transition-all duration-300 ease-in-out",
            isLeftSidebarOpen ? 'block' : 'hidden',
            'md:block'
        )}>
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className='flex items-center gap-4 mb-4'>
                  <UserAvatar user={loggedInUser} className="h-12 w-12" />
                  <div>
                    <h2 className="font-bold text-lg">{loggedInUser.name}</h2>
                    <p className="text-sm text-muted-foreground">Senior Developer</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsProfileDialogOpen(true)}><Edit /></Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chats..."
                    className="pl-10 h-12 rounded-full bg-background shadow-inner"
                    value={sidebarSearchTerm}
                    onChange={(e) => setSidebarSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="flex flex-col">
                  {filteredChats.map(chat => {
                    const participant = getParticipant(chat);
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    return (
                      <button
                        key={chat.id}
                        className={cn(
                          "flex items-center gap-4 p-4 text-left transition-colors hover:bg-sidebar-accent border-b",
                          selectedChat?.id === chat.id && "bg-sidebar-accent"
                        )}
                        onClick={() => {
                          setSelectedChat(chat);
                          if (window.innerWidth < 768) {
                            setIsLeftSidebarOpen(false);
                          }
                        }}
                      >
                        <UserAvatar user={chat.type === 'group' ? { id: chat.id, name: chat.name!, email: '', avatarUrl: chat.avatarUrl, isOnline: false, about: '' } : participant!} className="h-12 w-12" />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold truncate">
                            {chat.type === 'group' ? chat.name : participant?.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                            {lastMessage?.sender.id === loggedInUser.id && lastMessage.status && getMessageStatus(lastMessage.status)}
                            {lastMessage?.type === 'image' && 'Photo'}
                            {lastMessage?.type === 'file' && 'File'}
                            {lastMessage?.type === 'video' && 'Video'}
                            {lastMessage?.type === 'audio' && 'Audio'}
                            {(!lastMessage?.type || lastMessage?.type === 'text') && lastMessage?.content}
                          </p>
                        </div>
                        <div className="flex flex-col items-end text-xs text-muted-foreground space-y-1">
                          <span>
                            {lastMessage ? <ClientTime timestamp={lastMessage.timestamp} /> : ''}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex flex-col bg-background flex-1" style={mainContainerStyle}>
            {selectedChat ? (
              <>
                <header className="flex items-center justify-between border-b p-2 sm:p-4 bg-card/80 backdrop-blur-sm">
                  {isChatSearchOpen ? (
                    <div className="flex items-center gap-2 w-full">
                      <Search className="h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        value={chatSearchTerm}
                        onChange={(e) => setChatSearchTerm(e.target.value)}
                        className="h-8 border-none bg-transparent focus-visible:ring-0 shadow-none"
                      />
                      <Button variant="ghost" size="icon" onClick={() => { setIsChatSearchOpen(false); setChatSearchTerm('') }}>
                        <X className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsLeftSidebarOpen(true)}>
                          <Menu />
                        </Button>
                        <button onClick={() => setIsRightSidebarOpen(true)} className="flex items-center gap-3 text-left">
                          <div className="relative">
                            <UserAvatar user={selectedChat.type === 'group' ? { id: selectedChat.id, name: selectedChat.name!, email: '', avatarUrl: selectedChat.avatarUrl, isOnline: false, about: '' } : getParticipant(selectedChat)!} />
                            {(selectedChat.type === 'private' && getParticipant(selectedChat)?.isOnline) && (
                              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                            )}
                          </div>
                          <div>
                            <h2 className="font-semibold text-lg">{selectedChat.type === 'group' ? selectedChat.name : getParticipant(selectedChat)?.name}</h2>
                            {selectedChat.type === 'private' && <p className="text-sm text-muted-foreground">{getParticipant(selectedChat)?.isOnline ? 'Online' : 'Offline'}</p>}
                          </div>
                        </button>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                        <Button variant="ghost" size="icon"><Phone /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsVidCallDialogOpen(true)}><Video /></Button>
                        <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2" />
                        <Button variant="ghost" size="icon" onClick={() => setIsChatSearchOpen(true)}><Search /></Button>
                        <Button variant="ghost" size="icon" className='lg:hidden' onClick={() => setIsRightSidebarOpen(true)}><MoreVertical /></Button>
                      </div>
                    </>
                  )}
                </header>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(chatSearchTerm ? filteredMessages : selectedChat.messages)?.map(message => {
                      const isSender = message.sender.id === loggedInUser.id;
                      return (
                        <div
                          key={message.id}
                          className={cn("flex gap-3 items-end", isSender ? "justify-end" : "justify-start")}
                        >
                          {!isSender && <UserAvatar user={message.sender} className="h-8 w-8 self-end" />}
                          <div className={cn(
                            "max-w-xs sm:max-w-md rounded-lg p-3",
                            isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card border rounded-bl-none"
                          )}>
                            {message.type === 'image' ? (
                              <img
                                src={message.content}
                                alt="sent"
                                data-ai-hint="sent image"
                                className="rounded-md max-w-full cursor-pointer"
                                onClick={() => setViewedImage(message.content)}
                              />
                            ) : message.type === 'file' ? (
                              <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                                <div className="bg-red-100 text-red-600 p-2 rounded-md"><FileText className="h-6 w-6" /></div>
                                <div className="flex-1">
                                  <p className="font-semibold break-all">{message.content}</p>
                                  <a href="#" className="text-xs text-primary hover:underline">Download</a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm break-words">{message.content}</p>
                            )}
                            <div className={cn("flex items-center gap-2 text-xs mt-2",
                              isSender ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                            )}>
                              <ClientTime timestamp={message.timestamp} />
                              {isSender && message.status && getMessageStatus(message.status)}
                            </div>
                          </div>
                          {isSender && <UserAvatar user={message.sender} className="h-8 w-8 self-end" />}
                        </div>
                      )
                    })}
                    {isTyping && (
                      <div className="flex gap-2 items-center">
                        <UserAvatar user={getParticipant(selectedChat)!} className="h-8 w-8" />
                        <div className="bg-muted rounded-lg p-3 rounded-bl-none">
                          <p className="text-sm text-muted-foreground animate-pulse">Typing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <footer className="border-t bg-card/80 backdrop-blur-sm p-2 sm:p-4">
                  <form onSubmit={handleFormSubmit} className="flex items-center gap-2 bg-muted rounded-full p-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                          <Smile />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2 border-none mb-2">
                        <div className="grid grid-cols-8 gap-1">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleEmojiClick(emoji)}
                              className="text-xl sm:text-2xl hover:bg-accent rounded-md p-1"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                     <Popover>
                      <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                              <Paperclip />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2" side="top" align="start">
                          <div className="grid gap-1">
                              <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => photoInputRef.current?.click()}
                              >
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  Photo
                              </Button>
                              <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => fileInputRef.current?.click()}
                              >
                                  <FileText className="mr-2 h-4 w-4" />
                                  File
                              </Button>
                          </div>
                      </PopoverContent>
                    </Popover>

                    <Input
                      name="message"
                      placeholder="Write Something..."
                      autoComplete="off"
                      className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none h-auto py-0"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    
                    <Button type="submit" size="icon" className="bg-primary rounded-full h-10 w-10 shrink-0">
                      <Send />
                    </Button>
                  </form>
                </footer>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground text-center p-4">
                <PlusCircle className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-medium">Welcome to Chatterbox</h2>
                <p>Select a chat to start messaging.</p>
                <Button className="md:hidden mt-4" onClick={() => setIsLeftSidebarOpen(true)}>
                  <Menu className='mr-2' /> Select Chat
                </Button>
              </div>
            )}
          </main>
        </div>

        <div
          className={cn(
            'flex-shrink-0 w-full sm:w-96 bg-card border-l transition-all duration-300 ease-in-out',
            isRightSidebarOpen ? 'block' : 'hidden',
            'lg:block'
          )}
        >
           <RightSidebar
            user={selectedChat?.type === 'private' ? getParticipant(selectedChat) : null}
            chat={selectedChat}
            onClose={() => setIsRightSidebarOpen(false)} 
            onAttachmentClick={handleAttachmentClick}
            onWallpaperChange={handleWallpaperChange}
            />
        </div>
        
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <UserAvatar user={{ ...loggedInUser, avatarUrl: profileData.avatarUrl }} className="h-24 w-24" />
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full">
                  <ImageIcon className="h-4 w-4" />
                  <Input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProfileData({ ...profileData, avatarUrl: event.target?.result as string });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="about" className="text-right">
                About
              </label>
              <Textarea id="about" value={profileData.about} onChange={(e) => setProfileData({ ...profileData, about: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleProfileSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isVidCallDialogOpen} onOpenChange={setIsVidCallDialogOpen}>
        <DialogContent className="max-w-2xl w-[90vw] h-[80vh] flex flex-col p-0">
          <DialogHeader className='p-4'>
            <DialogTitle>Video Call</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted />
            <div className="absolute top-4 right-4 w-1/4 h-auto rounded-md overflow-hidden border-2 border-white">
              <img src="https://placehold.co/300x200.png" alt="Local user" data-ai-hint="video call screen" className="object-cover w-full h-full" />
            </div>
            {!(hasCameraPermission) && (
              <Alert variant="destructive" className='m-4 absolute bottom-4 left-4 right-4'>
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature. Your browser may be blocking the request.
                </AlertDescription>
              </Alert>
            )
            }
          </div>
          <DialogFooter className="bg-card p-4 flex justify-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><MicOff /></Button>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><VideoOff /></Button>
            <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={() => setIsVidCallDialogOpen(false)}>
              <PhoneOff />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAttachmentsDialogOpen} onOpenChange={setIsAttachmentsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Attachments</DialogTitle>
            <DialogDescription>
              View all media and files shared in this chat.
            </DialogDescription>
          </DialogHeader>
          <AttachmentsViewer chat={selectedChat} filter={attachmentFilter} onImageClick={(url) => {
            setViewedImage(url);
            setIsAttachmentsDialogOpen(false);
          }} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewedImage} onOpenChange={() => setViewedImage(null)}>
        <DialogContent className="max-w-3xl h-auto p-0 bg-transparent border-none">
            <DialogTitle className="sr-only">Viewed Image</DialogTitle>
          <img src={viewedImage!} alt="viewed image" className="w-full h-full object-contain rounded-lg" data-ai-hint="full screen image" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
