import {EmptyChats} from '@/components';
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
import {router} from 'expo-router';
import {useState} from 'react';
import {FlatList, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface User {
  uuid: string;
  username: string;
  email: string;
}

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const {bottom} = useSafeAreaInsets();

  const handlePressUser = (uuid: string) => {
    router.push(`/messages`);
  };

  return (
    <View flex={1}>
      <Heading color="$white" bg="$primary700" size="2xl" p="$4">
        Chats
      </Heading>
      <View px="$4" flex={1}>
        <Input size="md" rounded="$full" mt="$2" px="$0" height={48}>
          <InputSlot pl="$4">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search" />
        </Input>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
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
          ListEmptyComponent={<EmptyChats />}
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
      <Pressable
        position="absolute"
        right="$4"
        bottom={bottom}
        height={50}
        width={50}
        bg="$primary700"
        rounded="$full"
        alignItems="center"
        justifyContent="center">
        <Ionicons name="add" size={25} color="white" />
      </Pressable>
    </View>
  );
};

export default Home;
