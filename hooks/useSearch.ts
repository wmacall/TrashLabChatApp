import {useRef, useState} from 'react';
import {useAuthContext} from '@/context/auth.context';
import {usersRef} from '@/firebase';
import {getDocs, query, where} from 'firebase/firestore';
import {User} from '@/types';

export const useSearch = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {user} = useAuthContext();

  const onSearch = async (value: string) => {
    try {
      const queryUsers = query(
        usersRef,
        where('username', '>=', value),
        where('username', '<=', value + '\uf8ff'),
      );
      const usersFound = await getDocs(queryUsers);
      let users: User[] = [];
      usersFound.forEach(doc => {
        if (doc.data().uuid !== user?.uid) {
          users.push(doc.data() as User);
        }
      });
      setUsers(users);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSetSearch = (value: string) => {
    setIsLoading(true);
    setSearch(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (value !== '') {
        onSearch(value.toLowerCase());
      } else {
        setIsLoading(false);
        setUsers([]);
      }
    }, 750);
  };

  return {search, users, isLoading, handleSetSearch};
};
