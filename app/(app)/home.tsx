import {Text, TextInput, View} from 'react-native';

const Home = () => {
  return (
    <View>
      <View>
        <Text>Chats</Text>
        <TextInput placeholder="Search" />
      </View>
      <View>
        <Text>Start creating conversations</Text>
      </View>
    </View>
  );
};

export default Home;
