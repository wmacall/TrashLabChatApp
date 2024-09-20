import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {User, UserChat} from '@/types';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {useState} from 'react';

export const useChat = () => {
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuthContext();

  const handleGetChats = async () => {
    try {
      setIsLoading(true);
      const roomsRef = collection(db, 'rooms');
      const queryForRooms = query(
        roomsRef,
        where('createdBy', '==', user?.uid),
      );

      const roomsSnapshot = await getDocs(queryForRooms);
      let rooms: UserChat[] = [];
      const guestPromises = roomsSnapshot.docs.map(async doc => {
        const data = doc.data() as UserChat;

        const guestRef = collection(db, 'users');
        const queryForGuest = query(guestRef, where('uuid', '==', data.guest));
        const guestSnapshot = await getDocs(queryForGuest);

        let guestUser: User | null = null;
        guestSnapshot.forEach(doc => {
          guestUser = doc.data() as User;
        });
        return {...data, guestUser, roomId: doc.id};
      });
      rooms = await Promise.all(guestPromises);
      setUserChats(rooms);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return {
    handleGetChats,
    userChats,
    isLoading,
  };
};
