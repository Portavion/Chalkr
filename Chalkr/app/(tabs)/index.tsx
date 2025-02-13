import {
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";

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
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  usersTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../..//drizzle/migrations";
import { eq } from "drizzle-orm";
import { Ionicons } from "@expo/vector-icons";
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  // const [dbUsers, setDbUsers] = useState();
  const [loading, setLoading] = useState<Boolean>(false);
  //TODO: add to .env
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });
  const [workoutList, setWorkoutList] = useState<any | null>(null);
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

  useEffect(() => {
    if (!success) return;
    if (!user) return;

    (async () => {
      const userDb = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, String(user.email)));

      // const fetchedWorkouts = await db.select().from(workoutsTable);
      // setWorkoutList(fetchedWorkouts);

      if (userDb.length === 0) {
        await db.insert(usersTable).values([
          {
            email: String(user.email),
          },
        ]);
      }
    })();
  }, [success]);

  useFocusEffect(
    React.useCallback(() => {
      //do something when the screen is focused
      let isActive = true;
      const fetchWorkout = async () => {
        const fetchedWorkouts = await db.select().from(workoutsTable);
        if (isActive) {
          setWorkoutList(fetchedWorkouts);
        }
      };
      fetchWorkout();
      return () => {
        //do something when the screen is unfocused
        isActive = false;
      };
    }, []),
  );

  const handleDeleteWorkout = async (id: number) => {
    const deletedWorkout = await db
      .delete(workoutsTable)
      .where(eq(workoutsTable.id, id))
      .returning();

    const deletedAscentsWorkoutMatch = await db
      .delete(workoutAscentTable)
      .where(eq(workoutAscentTable.workout_id, deletedWorkout[0].id))
      .returning();

    for (let ascent of deletedAscentsWorkoutMatch) {
      if (ascent.ascent_id) {
        await db
          .delete(ascentsTable)
          .where(eq(ascentsTable.id, ascent.ascent_id));
      }
    }

    const fetchedWorkouts = await db.select().from(workoutsTable);
    setWorkoutList(fetchedWorkouts);
    await db.select().from(workoutAscentTable);
    await db.select().from(ascentsTable);
  };

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

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
      {workoutList &&
        workoutList.map((workout) => (
          <View
            key={workout.id}
            className="flex flex-row justify-around mx-24 items-center"
          >
            <Text className="text-center py-3">{workout.timestamp}</Text>
            <TouchableOpacity
              id={workout.id}
              onPress={() => {
                handleDeleteWorkout(workout.id);
              }}
              className="flex items-center w-12 rounded-md border border-input bg-red-700 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <Ionicons name="trash-outline" size={16} color={"white"} />
            </TouchableOpacity>
            <Link href={`/workoutDetails/${workout.id}`} asChild>
              <TouchableOpacity
                id={workout.id}
                //TODO: navigate to details page
                className="flex items-center w-12 rounded-md border border-input bg-amber-700 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={"white"}
                />
              </TouchableOpacity>
            </Link>
          </View>
        ))}
    </View>
  ) : (
    <SignInScreen promptAsync={promptAsync} />
  );
}
