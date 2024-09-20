import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {Ionicons} from '@expo/vector-icons';
import {Box, ChevronLeftIcon, Pressable} from '@gluestack-ui/themed';
import {Heading, Icon, View} from '@gluestack-ui/themed';
import {router} from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';

const Messages = () => {
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuthContext();

  useEffect(() => {
    const roomId = '1';
    const roomRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(roomRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    let unsubscribe = onSnapshot(q, querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
          },
        };
      });
      setMessages(messages);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      try {
        setMessages((previousMessages: any) =>
          GiftedChat.append(previousMessages, messages),
        );
        const roomId = '1';
        const roomRef = doc(db, 'rooms', roomId);
        const messagesRef = collection(roomRef, 'messages');

        await addDoc(messagesRef, {
          _id: messages[0]._id,
          user: {
            _id: user?.uid,
          },
          createdAt: messages[0].createdAt,
          text: messages[0].text,
        });
      } catch (error) {
        console.error('Error al enviar mensaje: ', error);
      }
    },
    [user?.uid],
  );

  const handleGoBack = () => router.back();

  return (
    <>
      <View flexDirection="row" alignItems="center" bg="$primary700">
        <Pressable onPress={handleGoBack} height="$full" px="$4" py="$4">
          <Icon as={ChevronLeftIcon} color="$white" size="xl" />
        </Pressable>
        <Heading color="$white" size="md">
          Diego Smith
        </Heading>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showAvatarForEveryMessage={false}
        renderAvatar={null}
        listViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        messagesContainerStyle={{
          backgroundColor: '#fff',
        }}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              paddingTop: 6,
              borderTopWidth: 0,
            }}
            primaryStyle={{alignItems: 'center', flexDirection: 'row'}}
          />
        )}
        renderComposer={props => (
          <Composer
            {...props}
            placeholderTextColor="#404040"
            placeholder="Type a message..."
            textInputStyle={{
              backgroundColor: '#f3f4f6',
              borderRadius: 20,
              paddingHorizontal: 16,
            }}
          />
        )}
        renderSend={props => (
          <Send
            {...props}
            disabled={!props.text}
            alwaysShowSend
            containerStyle={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 4,
            }}>
            <View bg="$primary700" rounded="$full" p="$2">
              <Ionicons name="send" size={14} color="white" />
            </View>
          </Send>
        )}
        user={{
          _id: user?.uid as string,
        }}
      />
      <SafeAreaView />
    </>
  );
};

export default Messages;
