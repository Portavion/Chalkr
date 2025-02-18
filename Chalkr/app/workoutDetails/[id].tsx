import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { count, eq, sql } from "drizzle-orm";
import AscentStats from "@/components/workoutStats/AscentStats";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

const WorkoutDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<ClimbingWorkout>();
  const [duration, setDuration] = useState(0);
  const [climbingTime, setClimbingTime] = useState(0);
  const [restingTime, setRestingTime] = useState(0);

  const [gradeDistribution, setGradeDistribution] = useState<
    {
      grade: number | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();
  const [styleDistribution, setStyleDistribution] = useState<
    {
      style: string | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();

  const workoutId = id.length > 0 ? Number(id) : Number(id);

  useEffect(() => {
    const fetchWorkout = async () => {
      const workout = (await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.id, workoutId))) as ClimbingWorkout[];

      if ((workout.length = 1)) {
        setWorkout(workout[0]);
        setDuration(workout[0].rest_time + workout[0].climb_time);
        setRestingTime(workout[0].rest_time);
        setClimbingTime(workout[0].climb_time);
      }
    };

    const fetchAscentsStats = async () => {
      const gradeDistributionData = await db
        .select({
          grade: ascentsTable.grade,
          ascentCount: count(), // Count the number of ascents per grade
          successfulAttempts: count(
            sql`CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 END`,
          ),
        })
        .from(ascentsTable)
        .innerJoin(
          workoutAscentTable,
          eq(ascentsTable.id, workoutAscentTable.ascent_id),
        )
        .where(eq(workoutAscentTable.workout_id, workoutId))
        .groupBy(ascentsTable.grade);

      setGradeDistribution(gradeDistributionData);

      const styleDistributionData = await db
        .select({
          style: ascentsTable.style,
          ascentCount: count(), // Count the number of ascents per grade
          successfulAttempts: count(
            sql`CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 END`,
          ),
        })
        .from(ascentsTable)
        .innerJoin(
          workoutAscentTable,
          eq(ascentsTable.id, workoutAscentTable.ascent_id),
        )
        .where(eq(workoutAscentTable.workout_id, workoutId))
        .groupBy(ascentsTable.style);

      setStyleDistribution(styleDistributionData);
    };

    fetchWorkout();
    fetchAscentsStats();
  }, [id]);

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
    router.back();
  };

  return (
    <SafeAreaView className="flex flex-col content-center justify-around">
      <Text className="my-2 text-xl font-bold ml-5">Workout {workoutId}</Text>
      {/* Basic stats */}
      <View className="flex flex-col justify-center">
        <Text className="text-black font-semibold ml-5  pb-4 ">
          {workout?.timestamp}
        </Text>

        <Text className="text-black font-semibold pb-2 ml-7 ">Timing</Text>
        <View className="bg-amber-50">
          <View className="flex flex-row items-center  mb-0.5">
            <Text className="text-black pl-10 w-60">Climb time</Text>
            <Text className="text-black w-24">
              {climbingTime >= 360 && (
                <>
                  {Math.floor(climbingTime / 360)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((climbingTime % 360) / 60)
                .toString()
                .padStart(2, "0")}
              :{(climbingTime % 60).toString().padStart(2, "0")}
            </Text>
          </View>

          <View className="flex flex-row items-center mb-0.5">
            <Text className="text-black pl-10 w-60">Total rest</Text>
            <Text className="text-black w-24">
              {restingTime >= 360 && (
                <>
                  {Math.floor(restingTime / 360)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((restingTime % 360) / 60)
                .toString()
                .padStart(2, "0")}
              :{(restingTime % 60).toString().padStart(2, "0")}
            </Text>
          </View>

          <View className="flex flex-row mb-0.5">
            <Text className="text-black pl-10 w-60">Total time</Text>
            <Text className="text-black w-24">
              {duration >= 360 && (
                <>
                  {Math.floor(duration / 360)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((duration % 360) / 60)
                .toString()
                .padStart(2, "0")}
              :{(duration % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>
      </View>

      {/* Ascent stats */}
      <AscentStats id={workoutId} />

      {/* Grade Distribution */}
      <Text className="text-black font-semibold pt-4 pb-2 ml-7  ">Grades</Text>
      {gradeDistribution?.map((grade) => (
        <View key={String(grade.grade)}>
          <View className="bg-amber-50">
            <View className="flex flex-row items-center mb-0.5">
              <Text className="text-black pl-10 w-60">
                V{grade.grade}: {grade.ascentCount} climbs
              </Text>
              <Text>
                {Math.floor(
                  100 * (grade.successfulAttempts / grade.ascentCount),
                )}
                % success
              </Text>
            </View>
          </View>
        </View>
      ))}
      {/* Style Distribution */}
      <Text className="text-black font-semibold pt-4 pb-2 ml-7  ">Styles</Text>
      {styleDistribution?.map((style) => (
        <View key={String(style.style)}>
          <View className="bg-amber-50">
            <View className="flex flex-row items-center mb-0.5">
              <Text className="text-black pl-10 w-60">
                {style.style}: {style.ascentCount} climbs
              </Text>
              <Text>
                {Math.floor(
                  100 * (style.successfulAttempts / style.ascentCount),
                )}
                % success
              </Text>
            </View>
          </View>
        </View>
      ))}
      {/* stats */}
      {/* stats */}
      <View className="mt-32">
        {/* <Link href="/(tabs)" asChild> */}
        <TouchableOpacity
          id={String(workoutId)}
          onPress={() => {
            handleDeleteWorkout(workoutId);
          }}
          className="flex items-center mx-44 rounded-md border border-input bg-red-800 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text className="text-white">Delete workout</Text>
        </TouchableOpacity>
        {/* </Link> */}
      </View>
    </SafeAreaView>
  );
};

export default WorkoutDetailsScreen;
