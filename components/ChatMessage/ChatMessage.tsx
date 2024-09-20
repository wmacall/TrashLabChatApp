import {
  IChatMessage,
  MessageImage,
  MessageImageProps,
} from 'react-native-gifted-chat';

interface ChatMessageProps extends MessageImageProps<IChatMessage> {}

export const ChatMessage = (props: ChatMessageProps) => (
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
);
