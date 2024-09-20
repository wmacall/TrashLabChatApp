import React from 'react';
import {Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Pressable,
  SearchIcon,
  View,
} from '@gluestack-ui/themed';

interface NewChatModalProps {
  isModalSearchVisible: boolean;
  handlePressShowModal: () => void;
}

export const NewChatModal = ({
  isModalSearchVisible,
  handlePressShowModal,
}: NewChatModalProps) => {
  return (
    <Modal
      visible={isModalSearchVisible}
      animationType="slide"
      presentationStyle="pageSheet">
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        p="$4">
        <Heading>New Chat</Heading>
        <Pressable
          onPress={handlePressShowModal}
          bg="$trueGray200"
          h={30}
          w={30}
          alignItems="center"
          justifyContent="center"
          rounded="$full">
          <Ionicons name="close" size={16} color="black" />
        </Pressable>
      </View>
      <View flex={1} px="$4">
        <Input size="md" rounded="$full" mt="$2" px="$0">
          <InputSlot pl="$4">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search name or email" />
        </Input>
      </View>
    </Modal>
  );
};
