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
import {doc, setDoc} from 'firebase/firestore';

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
});

export const AuthContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<null | User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = getMessageFromError(error);
      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };
  const onLogout = () => {
    signOut(auth);
  };
  const onRegister = async (
    email: string,
    username: string,
    password: string,
  ) => {
    setIsLoading(true);
    try {
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
      setIsLoading(false);
    } catch (error) {
      const errorMessage = getMessageFromError(error);
      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
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
