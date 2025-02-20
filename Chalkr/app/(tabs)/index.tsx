import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Avatar, Divider, Icon, ListItem } from "@rneui/themed";
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

import { drizzle } from "drizzle-orm/expo-sqlite";
import { usersTable, workoutsTable } from "../../db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../..//drizzle/migrations";
import { eq } from "drizzle-orm";
import { Ionicons } from "@expo/vector-icons";
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  //TODO: add to .env
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });
  const [workoutList, setWorkoutList] = useState<
    ClimbingWorkout[] | undefined
  >();
  const { success, error } = useMigrations(db, migrations);
  const [expandedWorkouts, setExpandedWorkouts] = useState<{
    [workoutId: number]: boolean;
  }>({});

  const handlePress = (workoutId: number) => {
    setExpandedWorkouts({
      ...expandedWorkouts,
      [workoutId]: !expandedWorkouts[workoutId],
    });
  };

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
      //TODO: add fetchWorkout hook to useWorkoutData
      const fetchWorkout = async () => {
        const fetchedWorkouts = (await db
          .select()
          .from(workoutsTable)) as ClimbingWorkout[];
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

  if (user && workoutList?.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No workouts</Text>
      </View>
    );
  }

  return user ? (
    <SafeAreaView className="flex-1">
      <View className="py-5">
        {workoutList &&
          workoutList.map((workout) => (
            // cards
            <View
              key={workout.id}
              className="pb-6 flex flex-row justify-center items-center"
            >
              <View className="bg-white rounded-xl p-5 shadow-sm w-2/3 h-auto justify-center items-center">
                <ListItem.Accordion
                  content={
                    <>
                      <Text className="text-lg">
                        {" "}
                        {String(workout.timestamp).split(" ", 1)},{" "}
                        {String(workout.timestamp).split(" ", 2)[1]}
                      </Text>
                    </>
                  }
                  isExpanded={expandedWorkouts[workout.id] || false}
                  icon={
                    <Icon name={"chevron-down"} type="material-community" />
                  }
                  // noIcon={true}
                  onPress={() => {
                    handlePress(workout.id);
                  }}
                >
                  {/* rest */}
                  {/* header */}
                  <View className=""></View>
                  {/* content */}
                  <View>
                    <Text className="text-lg ">
                      {Number(workout.climb_time) + Number(workout.rest_time)}
                    </Text>
                    <Text className="text-sm font-extralight">Total time </Text>
                    <View className="flex flex-row my-4 content-between ">
                      <View className="flex flex-col">
                        <Divider style={{ width: "90%" }} width={1} />
                        <Text className="text-lg mr-6">
                          {Math.floor(Number(workout.climb_time) / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor(Number(workout.climb_time) % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Text>
                        <Text className="text-sm  mr-6 font-extralight">
                          Climb time
                        </Text>
                      </View>
                      <View className="flex flex-col">
                        <Divider style={{ width: "90%" }} width={1} />
                        <Text className="text-lg mr-6 ">
                          {Math.floor(Number(workout.rest_time) / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor(Number(workout.rest_time) % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Text>
                        <Text className="text-sm  mr-6 font-extralight">
                          Rest time
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex items-center content-center">
                    <Link href={`/workoutDetails/${workout.id}`} asChild>
                      <TouchableOpacity
                        id={`${workout.id}`}
                        className="flex items-center rounded-md border border-amber-400 bg-amber-200 px-2 py-1 text-xs "
                      >
                        <Text className="text-black text-xs">details</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </ListItem.Accordion>
              </View>
            </View>
          ))}
      </View>
    </SafeAreaView>
  ) : (
    <SignInScreen promptAsync={promptAsync} />
  );
}
