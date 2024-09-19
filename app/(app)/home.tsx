import {useAuthContext} from '@/context/auth.context';
import {usersRef} from '@/firebase';
import {router} from 'expo-router';
import {getDocs, query, where} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, TextInput, View} from 'react-native';

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
    <View style={{flex: 1, padding: 16}}>
      <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
        Users
      </Text>
      <FlatList
        data={users}
        keyExtractor={item => item.uuid}
        renderItem={({item}) => (
          <Pressable
            onPress={() => handlePressUser(item.uuid)}
            style={{paddingVertical: 10}}>
            <Text style={{color: 'black', fontSize: 18}}>{item.username}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{color: 'black'}}>No users found</Text>
        }
      />
    </View>
  );
};

export default Home;
