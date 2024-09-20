// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore, collection} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDC4dpJl16yshCkk5lxpjIuGz3xcLZ9E6A',
  authDomain: 'trashlab-chatapp.firebaseapp.com',
  projectId: 'trashlab-chatapp',
  storageBucket: 'trashlab-chatapp.appspot.com',
  messagingSenderId: '198996878790',
  appId: '1:198996878790:web:aa1e4567ad8be061eb3ec7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
