import {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {AuthContextProvider, useAuthContext} from '@/context/auth.context';
import {Slot, Stack, useRouter, useSegments} from 'expo-router';
import {
  GluestackUIProvider,
  Text,
  Box,
  SafeAreaView,
} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';

const MainLayout = () => {
  const {isAuthenticated} = useAuthContext();
  const segments = useSegments();
  const {replace} = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }
    const isLogged = segments[0] === '(app)';
    if (isAuthenticated && !isLogged) {
      replace('/home');
    } else if (!isAuthenticated) {
      replace('/signIn');
    }
  }, [isAuthenticated]);
  return (
    <View style={{flex: 1}}>
      <SafeAreaView bg="$primary700" />
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: 'white', flex: 1},
        }}
      />
    </View>
  );
};

const _layout = () => {
  return (
    <GluestackUIProvider config={config}>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </GluestackUIProvider>
  );
};

export default _layout;
