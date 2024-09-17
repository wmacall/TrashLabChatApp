import {FIREBASE_ERRORS} from '@/constants/firebaseErrors';
import {FirebaseError} from 'firebase/app';

export const getMessageFromError = (error: unknown) => {
  const _error = error as FirebaseError;
  const errorCode = _error.code;
  return FIREBASE_ERRORS[errorCode] || 'An error occurred';
};
