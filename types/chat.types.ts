import {User} from './user.types';

export interface UserChat {
  createdBy: string;
  guest: string;
  guestUser: User | null;
  ownerUser: User | null;
  roomId: string;
  lastMessage: {
    text: string;
    lastMessageAt: Date;
    sender: string;
  } | null;
}
