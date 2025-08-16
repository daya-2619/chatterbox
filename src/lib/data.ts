import { User, Chat } from '@/types';

export const loggedInUser: User = {
  id: 'user-1',
  name: 'You',
  email: 'you@example.com',
  avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=U',
  isOnline: true,
  about: "Hey there! I am using Chatterbox.",
};

const users: User[] = [
  loggedInUser,
  {
    id: 'user-2',
    name: 'Maya',
    email: 'maya@example.com',
    avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=M',
    isOnline: true,
    about: "Designer and cat lover.",
  },
  {
    id: 'user-3',
    name: 'Sushu',
    email: 'sushu@example.com',
    avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=S',
    isOnline: false,
    about: "Coffee first, then code.",
  },
  {
    id: 'user-4',
    name: 'Pritam',
    email: 'pritam@example.com',
    avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=P',
    isOnline: true,
    about: "Exploring the world, one city at a time.",
  },
    {
    id: 'user-5',
    name: 'Pritam',
    email: 'pritam2@example.com',
    avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=P',
    isOnline: false,
    about: "Just a small town girl...",
  },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [users[0], users[1]],
    messages: [
      {
        id: 'msg-1-1',
        sender: users[1],
        content: "Hey, how's it going?",
        timestamp: '2023-10-25T10:00:00.000Z',
        status: 'seen',
      },
      {
        id: 'msg-1-2',
        sender: users[0],
        content: "I'm good, thanks! Just working on the new project. You?",
        timestamp: '2023-10-25T10:05:00.000Z',
        status: 'seen',
      },
       {
        id: 'msg-1-3',
        sender: users[1],
        content: "Same here. It's coming along well. Did you see the latest designs?",
        timestamp: '2023-10-25T10:10:00.000Z',
        status: 'delivered',
      },
       {
        id: 'msg-1-4',
        sender: users[1],
        content: 'https://placehold.co/300x200.png',
        timestamp: '2023-10-25T10:11:00.000Z',
        status: 'delivered',
        type: 'image',
       },
       {
        id: 'msg-1-5',
        sender: users[0],
        content: 'design-specs.pdf',
        timestamp: '2023-10-25T10:12:00.000Z',
        status: 'delivered',
        type: 'file',
       },
    ],
    unreadCount: 0,
  },
  {
    id: 'chat-2',
    type: 'group',
    name: 'Project Team',
    avatarUrl: 'https://placehold.co/100x100/B5B5B5/FFFFFF/png?text=P',
    participants: [users[0], users[2], users[3]],
    messages: [
      {
        id: 'msg-2-1',
        sender: users[3],
        content: "Team, let's sync up at 3 PM today.",
        timestamp: '2023-10-25T11:00:00.000Z',
        status: 'seen',
      },
      {
        id: 'msg-2-2',
        sender: users[0],
        content: "Sounds good. I'll be there.",
        timestamp: '2023-10-25T11:01:00.000Z',
        status: 'seen',
      },
       {
        id: 'msg-2-3',
        sender: users[2],
        content: "I have a conflict, can we do 4 PM instead?",
        timestamp: '2023-10-25T11:02:00.000Z',
        status: 'seen',
      },
    ],
    unreadCount: 1,
  },
  {
    id: 'chat-3',
    type: 'private',
    participants: [users[0], users[2]],
    messages: [
      {
        id: 'msg-3-1',
        sender: users[2],
        content: 'Can you review my PR when you have a moment?',
        timestamp: '2023-10-24T14:00:00.000Z',
        status: 'seen',
      },
      {
        id: 'msg-3-2',
        sender: users[0],
        content: 'Sure, I will take a look this afternoon.',
        timestamp: '2023-10-24T15:00:00.000Z',
        status: 'sent',
      },
    ],
    unreadCount: 0,
  },
  {
    id: 'chat-4',
    type: 'private',
    participants: [users[0], users[4]],
    messages: [
      {
        id: 'msg-4-1',
        sender: users[4],
        content: 'Lunch tomorrow?',
        timestamp: '2023-10-25T12:30:00.000Z',
        status: 'delivered',
      },
    ],
    unreadCount: 1,
  },
];
