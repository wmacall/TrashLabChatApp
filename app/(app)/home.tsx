import {useAuthContext} from '@/context/auth.context';
import {usersRef} from '@/firebase';
import {
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  View,
} from '@gluestack-ui/themed';
import {router} from 'expo-router';
import {getDocs, query, where} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, TextInput} from 'react-native';

interface User {
  uuid: string;
  username: string;
  email: string;
}

const Home = () => {
  const {user} = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);

  const handleGetUsers = async () => {
    const queryUsers = query(usersRef, where('uuid', '!=', user?.uid));
    const querySnapshot = await getDocs(queryUsers);
    let data: User[] = [];
    querySnapshot.forEach(doc => {
      const userData = doc.data() as User;
      data.push(userData);
    });
    setUsers(data);
  };

  const handlePressUser = (uuid: string) => {
    router.push(`/messages`);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <View>
      <Heading color="$white" bg="$primary700" size="2xl" p="$4">
        Chats
      </Heading>
      <View px="$4">
        <Input size="md" rounded="$full" mt="$2" px="$0">
          <InputSlot pl="$4">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search" />
        </Input>
        <FlatList
          data={users}
          keyExtractor={item => item.uuid}
          renderItem={({item}) => (
            <Pressable
              onPress={() => handlePressUser(item.uuid)}
              style={{paddingVertical: 10}}>
              <Text style={{color: 'black', fontSize: 18}}>
                {item.username}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={{color: 'black'}}>No users found</Text>
          }
        />
      </View>
    </View>
  );
};

export default Home;
