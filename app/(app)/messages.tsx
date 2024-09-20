import {useAuthContext} from '@/context/auth.context';
import {db} from '@/firebase';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';

const Messages = () => {
  const [messages, setMessages] = useState<any>([]);
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

  console.log(messages.map((message: any) => message.user._id));

  return (
    <>
      <View>
        <Text>Messages</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user?.uid as string,
        }}
      />
      <SafeAreaView />
    </>
  );
};

export default Messages;
