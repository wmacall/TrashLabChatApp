# TrashLab Challenge

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Design
The design, while not particularly flashy, was inspired by the WhatsApp home screen and some designs I found on Dribbble. The company logo was incorporated into the layout.

## Development Process
With limited experience using Expo, I had to research how to manage navigation, the differences between slot and stack navigation, and how to handle routes through files. This approach felt familiar since Next.js uses a similar method. Initially, I didn't plan to use any UI library, but due to practical considerations and time constraints, I decided to use [Gluestack v1](https://github.com/) (insert the link to its GitHub here). I chose the [GiftedChat]([https://github.com/FaridSafi/GiftedChat](https://github.com/FaridSafi/react-native-gifted-chat)) library for its simplicity.

Additionally, I utilized the [Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) from Expo. I implemented several hooks, although I didn't separate them all into their respective files, primarily to demonstrate the use of custom hooks. I would have liked to create a better UI for the images, but time limitations led me to the current solution. The same applies to the testing process.

I used Context because Expo's documentation recommends it, and Firebase has a method for data persistence. If that option hadn't been available, I would have opted for [Redux Persist](https://github.com/rt2zz/redux-persist) and [RTK](https://redux-toolkit.js.org/).

## Behavior

## Logout and persistance of the session

## Logout and persistance of the session
https://github.com/user-attachments/assets/b2eb9d53-e445-419f-8773-b38923939072

## Validations for signup

https://github.com/user-attachments/assets/353d03b9-aeee-4cca-8b34-8b29e191f08c

## Complete flow
https://drive.google.com/file/d/1Bn5WTFcMPxwrWtiOHbiL6YJPamn1XJsJ/view?usp=sharing




