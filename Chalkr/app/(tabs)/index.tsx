import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Divider, Icon, ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import * as Haptics from "expo-haptics";

import * as WebBrowser from "expo-web-browser";
import SignInScreen from "../screens/SignInScreen";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { workoutsTable } from "../../db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../..//drizzle/migrations";
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import * as SQLite from "expo-sqlite";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { user, loading, signInWithGoogle } = useAuth(); // Use Auth Context
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

  useFocusEffect(
    React.useCallback(() => {
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
      <ScrollView className="py-5 bg-stone-300">
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
                        {/* splits the date timestamp */}
                        {String(workout.timestamp).split(" ", 1)},{" "}
                        {String(workout.timestamp).split(" ", 2)[1]}
                      </Text>
                    </>
                  }
                  isExpanded={expandedWorkouts[workout.id] || false}
                  icon={
                    <Icon name={"chevron-down"} type="material-community" />
                  }
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );

                    handlePress(workout.id);
                  }}
                >
                  <View>
                    <Text className="text-lg ">
                      {Math.floor(
                        Number(workout.climb_time + workout.rest_time) / 60,
                      )
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor(
                        Number(workout.climb_time + workout.rest_time) % 60,
                      )
                        .toString()
                        .padStart(2, "0")}
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
                        onPress={Haptics.selectionAsync}
                      >
                        <Text className="text-black text-xs">details</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </ListItem.Accordion>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <SignInScreen promptAsync={signInWithGoogle} />
  );
}
