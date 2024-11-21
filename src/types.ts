export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  lastMeeting: string;
  review: number;
  status: 'online' | 'offline';
}

export interface Message {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Group {
  id: number;
  name: string;
  avatar: string;
  unreadCount: number;
}