import { Text, View, Button, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { User as FirebaseUser } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignInScreen from "../screens/SignInScreen";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  //TODO: add to .env
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUser(userData);
    } catch (error: unknown) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(FIREBASE_AUTH, credential);
    }
  }, [response]);

  useEffect(() => {
    checkLocalUser();
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return user ? (
    <View>
      <Text> Logged In as {user.email}</Text>
    </View>
  ) : (
    <SignInScreen promptAsync={promptAsync} />
  );
}
