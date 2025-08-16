export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  about: string;
}

export interface Message {
  id:string;
  sender: User;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  type?: 'text' | 'image' | 'file' | 'video' | 'audio';
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  participants: User[];
  messages: Message[];
  name?: string; // For group chats
  avatarUrl?: string; // For group chats
  unreadCount: number;
  wallpaper?: string;
}
