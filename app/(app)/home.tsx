import {ChatRow, EmptyChats, Header, NewChatModal} from '@/components';
import {useChat} from '@/hooks';
import {Ionicons} from '@expo/vector-icons';
import {Pressable, Spinner, Text, View} from '@gluestack-ui/themed';
import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Home = () => {
  const {bottom} = useSafeAreaInsets();
  const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);

  const {handleGetChats, userChats, isLoading} = useChat();
  const handlePressShowModal = () => setIsModalSearchVisible(prev => !prev);

  useEffect(() => {
    handleGetChats();
  }, []);

  return (
    <View flex={1}>
      <NewChatModal
        handlePressShowModal={handlePressShowModal}
        isModalSearchVisible={isModalSearchVisible}
      />
      <Header />
      {isLoading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary700" />
          <Text mt="$2">Loading chats...</Text>
        </View>
      ) : (
        <>
          <View px="$4" flex={1}>
            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              data={userChats}
              keyExtractor={chatInfo => chatInfo.roomId}
              renderItem={({item}) => <ChatRow {...item} />}
              ListEmptyComponent={<EmptyChats />}
              contentContainerStyle={{flexGrow: 1}}
            />
          </View>
          <Pressable
            onPress={handlePressShowModal}
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
        </>
      )}
    </View>
  );
};

export default Home;
