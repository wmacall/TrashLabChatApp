import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {Control, SubmitHandler, useController, useForm} from 'react-hook-form';
import {useRouter} from 'expo-router';
import {Entypo} from '@expo/vector-icons';
import {useAuthContext} from '@/context/auth.context';

interface SignInValues {
  email: string;
  password: string;
}

interface InputProps extends TextInputProps {
  control: Control<SignInValues, any>;
  name: keyof SignInValues;
}

const Input = ({control, name, ...rest}: InputProps) => {
  const {field} = useController({
    control,
    name,
  });
  return (
    <TextInput
      placeholder="Email"
      value={field.value}
      onChangeText={field.onChange}
      style={inputStyles.input}
      placeholderTextColor="#9e9e9e"
      {...rest}
    />
  );
};

const inputStyles = StyleSheet.create({
  input: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: '#eeeeee',
  },
});

export default function SignUp() {
  const {back} = useRouter();
  const {isLoading, onRegister} = useAuthContext();
  const {control, handleSubmit} = useForm<SignInValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp: SubmitHandler<SignInValues> = values =>
    onRegister(values.email, values.password);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Pressable style={styles.containerBackButton} onPress={back}>
        <Entypo name="chevron-thin-left" size={24} color="#424242" />
      </Pressable>
      <View style={styles.containerSignIn}>
        <Text style={styles.textLogin}>Sign Up</Text>
        <Input
          control={control}
          name="email"
          keyboardType="email-address"
          placeholder="Email"
          autoCapitalize="none"
        />
        <Input
          control={control}
          name="password"
          secureTextEntry
          placeholder="Password"
        />
        <Pressable
          style={styles.buttonSignIn}
          onPress={handleSubmit(handleSignUp)}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textButtonSignIn}>Sign Up</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  containerImage: {
    flex: 1,
  },
  containerBackButton: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  image: {
    width: 300,
    height: 300,
  },
  containerSignIn: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 64,
  },
  textLogin: {
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 72,
  },
  buttonSignIn: {
    backgroundColor: '#3f51b5',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 48,
  },
  textButtonSignIn: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  containerOr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#9e9e9e',
  },
  orText: {
    marginHorizontal: 16,
    color: '#757575',
  },
  buttonSignUp: {
    backgroundColor: '#e0e0e0',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  textButtonSignUp: {
    color: '#616161',
    fontSize: 16,
    fontWeight: '500',
  },
});
