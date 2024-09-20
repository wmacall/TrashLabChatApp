import {Ionicons} from '@expo/vector-icons';
import {View, Pressable} from '@gluestack-ui/themed';
import {IMessage, Send, SendProps} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage} from '@/firebase';

interface ChatSendProps extends SendProps<IMessage> {
  onSendImage: (url: string) => void;
}

export const ChatSend = (props: ChatSendProps) => {
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
          props.onSendImage(downloadURL);
        });
      },
    );
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await uploadToFirebase(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
        onPress={handlePickImage}
        bg="$primary700"
        mr="$4"
        rounded="$full"
        p="$2">
        <Ionicons name="images" size={14} color="white" />
      </Pressable>
    </>
  );
};
