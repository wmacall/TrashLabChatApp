import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import {auth, db} from '../firebase';
import {Alert} from 'react-native';
import {getMessageFromError} from '@/utils/getMessageFromError';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext({
  user: null as User | null,
  isAuthenticated: null as boolean | null,
  onLogin: (_email: string, _password: string) => {},
  onLogout: () => {},
  onRegister: (_email: string, _username: string, _password: string) => {},
  isLoading: false,
  username: null as string | null,
});

export const AuthContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<null | User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const getUsername = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get user details');
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      await getUsername(response.user.uid);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = getMessageFromError(error);
      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };
  const onLogout = () => {
    signOut(auth);
    setUsername(null);
  };
  const onRegister = async (
    email: string,
    username: string,
    password: string,
  ) => {
    setIsLoading(true);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'Username already exists');
        setIsLoading(false);
        return;
      }
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await setDoc(doc(db, 'users', response.user.uid), {
        email,
        username,
        uuid: response.user.uid,
      });

      setUsername(username);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = getMessageFromError(error);
      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        await getUsername(user.uid);
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        onLogin,
        onLogout,
        onRegister,
        isLoading,
        username,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthContext must be used within a AuthContextProvider');
  }
  return context;
};
