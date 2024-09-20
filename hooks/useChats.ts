import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {User, UserChat} from '@/types';
import {router} from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {useState} from 'react';

export const useChat = (handlePressShowModal: () => void) => {
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
      console.log(rooms);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async (userSelected: User) => {
    try {
      const roomId = `${userSelected.uuid}-${user?.uid}`;
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomRef);
      if (!roomSnapshot.exists()) {
        await setDoc(roomRef, {
          createdBy: user?.uid,
          guest: userSelected.uuid,
        });
      }
      handlePressShowModal();
      router.push({
        pathname: '/messages',
        params: {
          roomId,
          username: userSelected.username,
        },
      });
    } catch (error) {}
  };

  return {
    handleGetChats,
    userChats,
    isLoading,
    handleCreateChat,
  };
};
