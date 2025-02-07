import React from "react";
import { View, SafeAreaView, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";

type SignInScreenProps = {
  promptAsync: (
    options?: AuthRequestPromptOptions,
  ) => Promise<AuthSessionResult>;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ promptAsync }) => {
  return (
    <SafeAreaView className="flex flex-col items-center content-center justify-around">
      <Text className="mt-60 text-xl font-bold">Sign In</Text>
      <Pressable
        className="bg-amber-500 shadow w-2/4 h-20 ml-30 rounded-xl justify-center items-center text-white content-center gap-14 mt-16 mb-4"
        onPress={() => promptAsync()}
      >
        <View className="flex flex-row items-center justify-center">
          <AntDesign name="google" size={30} color={"white"}></AntDesign>
          <Text className="text-white ml-4">Sign In with Google</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignInScreen;
