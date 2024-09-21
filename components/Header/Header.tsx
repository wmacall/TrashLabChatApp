import {Ionicons} from '@expo/vector-icons';
import {Heading, Pressable, Text, View} from '@gluestack-ui/themed';
import {useState} from 'react';
import {LogOutModal} from '../LogOutModal';
import {useAuthContext} from '@/context/auth.context';

export const Header = () => {
  const {user, username} = useAuthContext();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  return (
    <View
      flexDirection="row"
      alignItems="center"
      bg="$primary700"
      p="$4"
      justifyContent="space-between">
      <View>
        <Heading color="$white" size="2xl">
          Chats
        </Heading>
        <Text color="$white" size="sm">
          Welcome back {username}!
        </Text>
      </View>
      <Pressable
        onPress={() => {
          setShowAlertDialog(true);
        }}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}>
        <Ionicons name="log-out" size={24} color="white" />
      </Pressable>
      <LogOutModal
        isVisible={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
      />
    </View>
  );
};
