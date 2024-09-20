import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useRouter} from 'expo-router';
import {useAuthContext} from '@/context/auth.context';
import {
  Button,
  ButtonText,
  Heading,
  Input,
  KeyboardAvoidingView,
  Pressable,
  View,
} from '@gluestack-ui/themed';
import {InputField} from '@gluestack-ui/themed';
import {Image} from '@gluestack-ui/themed';
import {ButtonSpinner} from '@gluestack-ui/themed';
import {Ionicons} from '@expo/vector-icons';

interface SignUpValues {
  email: string;
  password: string;
  username: string;
}

export default function SignUp() {
  const {back} = useRouter();
  const {onRegister, isLoading} = useAuthContext();
  const {control, handleSubmit} = useForm<SignUpValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp: SubmitHandler<SignUpValues> = values =>
    onRegister(values.email, values.username, values.password);

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <View
        py="$4"
        bg="$primary700"
        alignItems="center"
        justifyContent="center">
        <Pressable onPress={back} position="absolute" left={0} p="$4">
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </Pressable>
        <Heading
          textAlign="center"
          fontSize={24}
          fontWeight="bold"
          zIndex={10}
          color="white">
          Sign Up
        </Heading>
      </View>
      <View
        px="$4"
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        pb="$4">
        <View flex={1} alignItems="center" justifyContent="center">
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            alt="Logo"
            h={120}
            w={200}
          />
          <Controller
            render={({field}) => (
              <Input mt="$4" rounded="$2xl" size="md">
                <InputField
                  placeholder="Enter your email"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="email-address"
                />
              </Input>
            )}
            name="email"
            control={control}
          />
          <Controller
            render={({field}) => (
              <Input mt="$4" rounded="$2xl" size="md">
                <InputField
                  placeholder="Enter your username"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Input>
            )}
            name="username"
            control={control}
          />
          <Controller
            render={({field}) => (
              <Input mt="$4" rounded="$2xl" size="md">
                <InputField
                  type="password"
                  placeholder="Enter your password"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Input>
            )}
            name="password"
            control={control}
          />
        </View>
        <View>
          <Button
            bg="$primary700"
            onPress={handleSubmit(handleSignUp)}
            rounded="$xl">
            {!isLoading ? <ButtonText>Register</ButtonText> : <ButtonSpinner />}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
