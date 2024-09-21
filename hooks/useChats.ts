import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {User, UserChat} from '@/types';
import {router} from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import {useState, useEffect} from 'react';

export const useChat = (handlePressShowModal?: () => void) => {
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const {user} = useAuthContext();

  const handleGetChats = () => {
    setIsLoading(true);
    const roomsRef = collection(db, 'rooms');
    const unsubscribe = onSnapshot(roomsRef, async roomsSnapshot => {
      let rooms: UserChat[] = [];
      const guestPromises = roomsSnapshot.docs.map(async doc => {
        const data = doc.data() as UserChat;
        const roomId = doc.id;
        const [user1, user2] = roomId.split('-');
        if (user1 === user?.uid || user2 === user?.uid) {
          if (data.lastMessage !== null) {
            const guestRef = collection(db, 'users');
            const queryForGuest = query(
              guestRef,
              where('uuid', '==', data.guest),
            );
            const guestSnapshot = await getDocs(queryForGuest);
            let guestUser: User | null = null;
            guestSnapshot.forEach(doc => {
              guestUser = doc.data() as User;
            });
            const ownerRef = collection(db, 'users');
            const queryForOwner = query(
              ownerRef,
              where('uuid', '==', data.createdBy),
            );
            const ownerSnapshot = await getDocs(queryForOwner);
            let ownerUser: User | null = null;
            ownerSnapshot.forEach(doc => {
              ownerUser = doc.data() as User;
            });
            return {...data, guestUser, ownerUser, roomId: doc.id};
          }
        }
        return null;
      });

      rooms = (await Promise.all(guestPromises)).filter(
        room => room !== null,
      ) as UserChat[];
      setUserChats(rooms);
      setIsLoading(false);
    });

    return unsubscribe;
  };

  const handleCreateChat = async (userSelected: User) => {
    try {
      setIsDisabled(true);
      const roomId = `${userSelected.uuid}-${user?.uid}`;
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomRef);
      if (!roomSnapshot.exists()) {
        await setDoc(roomRef, {
          createdBy: user?.uid,
          guest: userSelected.uuid,
          lastMessage: null,
        });
      }
      handlePressShowModal?.();
      setIsDisabled(false);
      router.push({
        pathname: '/messages',
        params: {
          roomId,
          username: userSelected.username,
        },
      });
    } catch (error) {
      setIsDisabled(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = handleGetChats();

    return () => unsubscribe();
  }, []);

  return {
    handleGetChats,
    userChats,
    isLoading,
    handleCreateChat,
    isDisabled,
  };
};
