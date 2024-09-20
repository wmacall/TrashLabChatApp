import {FlatList, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Pressable,
  SearchIcon,
  Spinner,
  View,
} from '@gluestack-ui/themed';
import {UserRow} from '../UserRow/UserRow';
import {useChat, useSearch} from '@/hooks';

interface NewChatModalProps {
  isModalSearchVisible: boolean;
  handlePressShowModal: () => void;
}

export const NewChatModal = ({
  isModalSearchVisible,
  handlePressShowModal,
}: NewChatModalProps) => {
  const {handleSetSearch, isLoading, search, users} = useSearch();
  const {handleCreateChat} = useChat(handlePressShowModal);

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
        <Input size="md" rounded="$full" my="$2" px="$0">
          <InputSlot pl="$4">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            placeholder="Search name or email"
            value={search}
            onChangeText={handleSetSearch}
          />
          <InputSlot pr="$4">
            {isLoading ? <Spinner color="$trueGray500" /> : null}
          </InputSlot>
        </Input>
        <FlatList
          data={users}
          keyExtractor={item => item.uuid}
          renderItem={({item}) => (
            <UserRow onPress={handleCreateChat} user={item} />
          )}
        />
      </View>
    </Modal>
  );
};
