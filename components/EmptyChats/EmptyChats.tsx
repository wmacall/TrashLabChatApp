import React from 'react';
import {Center, Heading, Image} from '@gluestack-ui/themed';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const EmptyChats = () => {
  const {bottom} = useSafeAreaInsets();
  const padding = bottom + 48;
  return (
    <Center flex={1} paddingBottom={padding}>
      <Image
        source={require('../../assets/images/chat_empty.jpg')}
        height={300}
        width={300}
        alt="Empty chats"
        my="$4"
      />
      <Heading textAlign="center">
        {`No chats yet.\nStart a conversation by tapping on plus button.`}
      </Heading>
    </Center>
  );
};
