import {User} from './user.types';

export interface UserChat {
  createdBy: string;
  guest: string;
  guestUser: User | null;
  roomId: string;
}
