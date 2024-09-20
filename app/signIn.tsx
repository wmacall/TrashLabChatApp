import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useRouter} from 'expo-router';
import {useAuthContext} from '@/context/auth.context';
import {
  Button,
  ButtonText,
  Heading,
  Input,
  KeyboardAvoidingView,
  View,
} from '@gluestack-ui/themed';
import {InputField} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {Image} from '@gluestack-ui/themed';
import {ButtonSpinner} from '@gluestack-ui/themed';

interface SignInValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const {push} = useRouter();
  const {onLogin, isLoading} = useAuthContext();
  const {control, handleSubmit} = useForm<SignInValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn: SubmitHandler<SignInValues> = values =>
    onLogin(values.email, values.password);

  const handleSignUp = () => push('/signUp');

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <Heading
        bg="$primary700"
        textAlign="center"
        fontSize={24}
        fontWeight="bold"
        zIndex={10}
        color="white"
        py="$4">
        Sign In
      </Heading>
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
              <Input mt="$4" rounded="$2xl" size="lg">
                <InputField
                  placeholder="Enter your email"
                  autoCapitalize="none"
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
              <Input mt="$4" rounded="$2xl" size="lg">
                <InputField
                  type="password"
                  placeholder="Enter your password"
                  autoCapitalize="none"
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
            onPress={handleSubmit(handleSignIn)}
            rounded="$xl">
            {!isLoading ? <ButtonText>Sign In</ButtonText> : <ButtonSpinner />}
          </Button>
          <View flexDirection="row" alignItems="center" my="$2">
            <View h={1} flex={1} w={16} bg="$coolGray200" />
            <Text color="$coolGray400" mx="$2">
              or
            </Text>
            <View flex={1} h={1} w={16} bg="$coolGray200" />
          </View>
          <Button bg="$coolGray400" onPress={handleSignUp} rounded="$xl">
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
