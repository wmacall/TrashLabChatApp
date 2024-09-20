import {Heading, Pressable, Text, View} from '@gluestack-ui/themed';
import {router} from 'expo-router';
import {UserChat} from '@/types';
import {useAuthContext} from '@/context/auth.context';

interface ChatRowProps extends UserChat {}

export const ChatRow = ({guestUser, roomId, lastMessage}: ChatRowProps) => {
  const {user} = useAuthContext();
  const handlePressRow = () => {
    router.push({
      pathname: '/messages',
      params: {
        roomId,
        username: guestUser?.username,
      },
    });
  };
  const lastMessageText = `${
    user?.uid === lastMessage.sender ? 'You' : guestUser?.username
  }: ${lastMessage.text}`;

  return (
    <Pressable onPress={handlePressRow} py="$4">
      <View flexDirection="row" alignItems="center">
        <View
          w={40}
          h={40}
          bg="$primary700"
          rounded="$full"
          mr="$2"
          alignItems="center"
          justifyContent="center">
          <Heading color="$white" fontSize={16} fontWeight="bold">
            {guestUser?.username[0].toUpperCase()}
          </Heading>
        </View>
        <View ml="$2">
          <Text>{guestUser?.username}</Text>
          <Text fontSize="$xs" color="$trueGray500">
            {lastMessageText}
          </Text>
        </View>
      </View>
      <View borderBottomWidth={1} borderBottomColor="$trueGray200" mt="$4" />
    </Pressable>
  );
};
