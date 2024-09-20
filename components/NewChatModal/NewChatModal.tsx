import React, {useRef, useState} from 'react';
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
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db, usersRef} from '@/firebase';
import {User} from '@/types';
import {UserRow} from '../UserRow/UserRow';
import {useAuthContext} from '@/context/auth.context';
import {router} from 'expo-router';

interface NewChatModalProps {
  isModalSearchVisible: boolean;
  handlePressShowModal: () => void;
}

export const NewChatModal = ({
  isModalSearchVisible,
  handlePressShowModal,
}: NewChatModalProps) => {
  const [search, setSearch] = React.useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuthContext();

  const onSearch = async (value: string) => {
    try {
      const queryUsers = query(
        usersRef,
        where('username', '>=', value),
        where('username', '<=', value + '\uf8ff'),
      );
      const usersFound = await getDocs(queryUsers);
      let users: User[] = [];
      usersFound.forEach(doc => {
        if (doc.data().uuid !== user?.uid) {
          users.push(doc.data() as User);
        }
      });
      setUsers(users);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSetSearch = (value: string) => {
    setSearch(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (value !== '') {
        setIsLoading(true);
        onSearch(value.toLowerCase());
      } else {
        setUsers([]);
      }
    }, 750);
  };

  const handleCreateChat = async (userSelected: User) => {
    try {
      const roomId = `${userSelected.uuid}-${user?.uid}`;
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomRef);
      if (!roomSnapshot.exists()) {
        await setDoc(roomRef, {
          createdBy: user?.uid,
          guest: userSelected.uuid,
        });
      }
      handlePressShowModal();
      router.push({
        pathname: '/messages',
        params: {
          roomId,
          username: userSelected.username,
        },
      });
    } catch (error) {}
  };

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
