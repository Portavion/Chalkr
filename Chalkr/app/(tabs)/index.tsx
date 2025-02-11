import { Text, View, Button, ActivityIndicator } from "react-native";
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

import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { usersTable, workoutsTable } from "../../db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../..//drizzle/migrations";
import { eq } from "drizzle-orm";
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUsers, setDbUsers] = useState();
  const [loading, setLoading] = useState<Boolean>(false);
  //TODO: add to .env
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });
  const { success, error } = useMigrations(db, migrations);

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
        const userDb = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, String(user.email)));

        if (!userDb) {
          await db.insert(usersTable).values([
            {
              email: String(user.email),
            },
          ]);
        }
      } else {
      }
    });
    return () => unsubscribe();
  }, []);

  let workouts;

  useEffect(() => {
    if (!success) return;
    if (!user) return;

    (async () => {
      const userDb = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, String(user.email)));

      workouts = await db.select().from(workoutsTable);

      if (userDb.length === 0) {
        await db.insert(usersTable).values([
          {
            email: String(user.email),
          },
        ]);
      }
    })();
  }, [success]);

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  console.log(workouts);

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
