import {Ionicons} from '@expo/vector-icons';
import {Heading, Pressable, View} from '@gluestack-ui/themed';
import {useState} from 'react';
import {LogOutModal} from '../LogOutModal';

export const Header = () => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  return (
    <View
      flexDirection="row"
      alignItems="center"
      bg="$primary700"
      p="$4"
      justifyContent="space-between">
      <Heading color="$white" size="2xl">
        Chats
      </Heading>
      <Pressable
        onPress={() => {
          setShowAlertDialog(true);
        }}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}>
        <Ionicons name="log-out" size={24} color="white" />
      </Pressable>
      <LogOutModal
        isVisible={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
      />
    </View>
  );
};
