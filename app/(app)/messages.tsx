import {useAuthContext} from '@/context/auth.context';
import {db, storage} from '@/firebase';
import {Ionicons} from '@expo/vector-icons';
import {ChevronLeftIcon, Pressable, Toast} from '@gluestack-ui/themed';
import {Heading, Icon, View} from '@gluestack-ui/themed';
import {router, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  MessageImage,
  Bubble,
  Time,
} from 'react-native-gifted-chat';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from 'firebase/storage';

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

  const uploadToFirebase = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'chats/' + new Date().getTime());

    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      error => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          onSendImage(downloadURL);
        });
      },
    );
  };

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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const resultImage = await uploadToFirebase(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
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
        renderBubble={props => {
          const isCurrentUser = props.currentMessage?.user._id === user?.uid;
          const isImageMessage = !!props.currentMessage?.image;

          let backgroundColor;
          if (isImageMessage) {
            backgroundColor = '#d3d3d3';
          } else if (isCurrentUser) {
            backgroundColor = '#ff6347';
          } else {
            backgroundColor = '#32cd32';
          }

          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  marginVertical: 5,
                  backgroundColor: isImageMessage ? '#f3f4f6' : '#32cd32',
                },
                right: {
                  marginVertical: 5,
                  backgroundColor: isImageMessage ? '#f3f4f6' : '#ff6347',
                },
              }}
              renderTime={props => (
                <Time
                  {...props}
                  timeTextStyle={{
                    left: {
                      color: isImageMessage ? '#404040' : '#fff',
                    },
                    right: {
                      color: isImageMessage ? '#404040' : '#fff',
                    },
                  }}
                />
              )}
              tickStyle={{
                color: 'blue',
              }}
            />
          );
        }}
        renderMessageImage={props => (
          <MessageImage
            {...props}
            containerStyle={{
              backgroundColor: '#f3f4f6',
              marginVertical: 10,
            }}
            imageStyle={{
              backgroundColor: '#f3f4f6',
              width: 200,
              height: 200,
              borderRadius: 10,
            }}
          />
        )}
        renderSend={props => (
          <>
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
            <Pressable
              onPress={pickImage}
              bg="$primary700"
              mr="$4"
              rounded="$full"
              p="$2">
              <Ionicons name="images" size={14} color="white" />
            </Pressable>
          </>
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
