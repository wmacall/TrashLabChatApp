import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {ChevronLeftIcon, Pressable, Toast} from '@gluestack-ui/themed';
import {Heading, Icon, View} from '@gluestack-ui/themed';
import {router, useLocalSearchParams} from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
} from 'react-native-gifted-chat';
import {ChatBubble} from '@/components/ChatBubble';
import {ChatMessage, ChatSend} from '@/components';

const Messages = () => {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuthContext();
  const roomId = String(params.roomId);
  const username = String(params.username);

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId as string);
    const messagesRef = collection(roomRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    let unsubscribe = onSnapshot(q, querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          image: data.image,
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
        const roomRef = doc(db, 'rooms', roomId as string);
        const messagesRef = collection(roomRef, 'messages');
        await updateDoc(roomRef, {
          lastMessage: {
            text: messages[0].text,
            lastMessageAt: messages[0].createdAt,
            sender: user?.uid,
          },
        });

        await addDoc(messagesRef, {
          _id: messages[0]._id,
          user: {
            _id: user?.uid,
          },
          createdAt: messages[0].createdAt,
          text: messages[0].text,
        });
      } catch (error) {
        Toast;
      }
    },
    [user?.uid],
  );

  const handleGoBack = () => router.back();

  const onSendImage = async (imageURL: string) => {
    const message: IMessage = {
      _id: new Date().getTime(),
      text: '',
      createdAt: new Date(),
      user: {
        _id: user?.uid as string,
      },
      image: imageURL,
    };

    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, [message]),
    );

    const roomRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(roomRef, 'messages');

    await addDoc(messagesRef, {
      ...message,
    });

    await updateDoc(roomRef, {
      lastMessage: {
        text: 'Image sent',
        lastMessageAt: message.createdAt,
        sender: user?.uid,
      },
    });
  };

  return (
    <>
      <View flexDirection="row" alignItems="center" bg="$primary700">
        <Pressable onPress={handleGoBack} height="$full" px="$4" py="$4">
          <Icon as={ChevronLeftIcon} color="$white" size="xl" />
        </Pressable>
        <Heading color="$white" size="md">
          {username}
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
        renderBubble={props => <ChatBubble {...props} />}
        renderMessageImage={props => <ChatMessage {...props} />}
        renderSend={props => <ChatSend onSendImage={onSendImage} {...props} />}
        user={{
          _id: user?.uid as string,
        }}
      />
      <SafeAreaView />
    </>
  );
};

export default Messages;
