import {AuthContextProvider, useAuthContext} from '@/context/auth.context';
import {Slot, Stack, useRouter, useSegments} from 'expo-router';
import {useEffect} from 'react';
import {SafeAreaView, View} from 'react-native';

const MainLayout = () => {
  const {isAuthenticated} = useAuthContext();
  const segments = useSegments();
  const {replace} = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }
    const isLogged = segments[0] === '(app)';
    console.log({segments});
    if (isAuthenticated && !isLogged) {
      replace('/(app)/home');
    } else if (!isAuthenticated) {
      replace('/signIn');
    }
  }, [isAuthenticated]);
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#fff'},
        }}
      />
    </View>
  );
};

const _layout = () => {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
};

export default _layout;
