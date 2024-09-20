import {
  Bubble,
  BubbleProps,
  IMessage,
  MessageText,
  Time,
} from 'react-native-gifted-chat';

interface ChatBubble extends BubbleProps<IMessage> {}

export const ChatBubble = (props: ChatBubble) => {
  const isImageMessage = !!props.currentMessage?.image;
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          marginVertical: 5,
          backgroundColor: isImageMessage ? '#f3f4f6' : '#737373',
        },
        right: {
          marginVertical: 5,
          backgroundColor: isImageMessage ? '#f3f4f6' : '#004282',
        },
      }}
      renderMessageText={props => (
        <MessageText
          {...props}
          textStyle={{
            left: {
              color: isImageMessage ? '#404040' : '#fff',
            },
          }}
        />
      )}
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
};
