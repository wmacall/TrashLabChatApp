import React from 'react';
import {Pressable, View, Heading} from '@gluestack-ui/themed';
import {User} from '@/types';

interface UserRowProps {
  user: User;
  onPress: (user: User) => void;
  isDisabled?: boolean;
}

export const UserRow = ({user, onPress, isDisabled = false}: UserRowProps) => {
  const handlePress = () => {
    onPress(user);
  };

  return (
    <>
      <Pressable
        key={user.uuid}
        py="$2"
        flexDirection="row"
        alignItems="center"
        disabled={isDisabled}
        onPress={handlePress}>
        <View
          w={40}
          h={40}
          bg="$trueGray200"
          rounded="$full"
          mr="$2"
          alignItems="center"
          justifyContent="center">
          <Heading color="$trueGray800" fontSize={16} fontWeight="bold">
            {user.username[0].toUpperCase()}
          </Heading>
        </View>
        <Heading>{user.username}</Heading>
      </Pressable>
      <View bg="$trueGray200" h={1} w="100%" />
    </>
  );
};
