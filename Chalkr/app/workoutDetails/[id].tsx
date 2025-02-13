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
import { and, count, eq, inArray, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

const WorkoutDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<ClimbingWorkout>();
  const [duration, setDuration] = useState(0);
  const [climbingTime, setClimbingTime] = useState(0);
  const [restingTime, setRestingTime] = useState(0);
  const [ascentCount, setAscentCount] = useState(0);
  const [ascentFailCount, setAscentFailCount] = useState(0);
  const [ascentSuccessCount, setAscentSuccessCount] = useState(0);
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

  const workoutId = id.length > 0 ? Number(id[0]) : Number(id);

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
      const ascents = await db
        .selectDistinct({ id: workoutAscentTable.ascent_id })
        .from(workoutAscentTable)
        .where(eq(workoutAscentTable.workout_id, workoutId));
      const ascentsIds = ascents
        .map((ascent) => ascent?.id)
        .filter((id) => id !== null);

      const countAscents = await db
        .select({ total: count(ascentsTable.id) })
        .from(ascentsTable)
        .where(inArray(ascentsTable.id, ascentsIds));
      setAscentCount(countAscents[0]?.total);

      const countSuccessfulAscents = await db
        .select({ total: count(ascentsTable.id) })
        .from(ascentsTable)
        .where(
          and(
            inArray(ascentsTable.id, ascentsIds),
            eq(ascentsTable.isSuccess, true),
          ),
        );
      setAscentSuccessCount(countSuccessfulAscents[0]?.total);

      const countFailedAscent = await db
        .select({ total: count(ascentsTable.id) })
        .from(ascentsTable)
        .where(
          and(
            inArray(ascentsTable.id, ascentsIds),
            eq(ascentsTable.isSuccess, false),
          ),
        );
      setAscentFailCount(countFailedAscent[0]?.total);

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
    <SafeAreaView className="flex flex-col items-center content-center justify-around">
      <Text className="my-5 text-xl font-bold">Workout {workoutId}</Text>
      {/* Basic stats */}
      <View className="flex flex-col items-center justify-center">
        <Text className="text-black ml-4">Date: {workout?.timestamp}</Text>
        <Text className="text-black ml-4">
          Session duration: {Math.floor(duration / 360)} hours{" "}
          {Math.floor((duration % 360) / 60)} min {duration % 60}s
        </Text>
        <Text className="text-black ml-4">
          Climbing time:
          {Math.floor(climbingTime / 360)} hours{" "}
          {Math.floor((climbingTime % 360) / 60)} min {climbingTime % 60}s
        </Text>
        <Text className="text-black ml-4">
          Resting time:
          {Math.floor(restingTime / 360)} hours{" "}
          {Math.floor((restingTime % 360) / 60)} min {restingTime % 60}s
        </Text>
        <Text className="text-black ml-4"></Text>
      </View>
      {/* Ascent stats */}
      <View className="flex mb-5 flex-col items-center justify-center">
        <Text className="text-black ml-4">Total climbs: {ascentCount}</Text>
        {/* Timing stats: avg rest and climbing time, ration climbing for resting */}
        <Text className="text-black ml-4">
          Successful climbs: {ascentSuccessCount} (
          {Math.floor((100 * ascentSuccessCount) / ascentCount)}% success rate)
        </Text>
        <Text className="text-black ml-4">
          Failed Climbs: {ascentFailCount}
        </Text>
      </View>
      {/* Grade Distribution */}
      <Text className="text-xl font-bold">Grades climbed:</Text>
      {gradeDistribution?.map((grade) => (
        <View key={String(grade.grade)}>
          <Text className="text-black ml-4">
            V{grade.grade}: {grade.ascentCount} climbs (
            {Math.floor(100 * (grade.successfulAttempts / grade.ascentCount))}%
            success rate)
          </Text>
        </View>
      ))}
      {/* Style Distribution */}
      <Text className="mt-5 text-xl font-bold">Styles climbed:</Text>
      {styleDistribution?.map((style) => (
        <View key={String(style.style)}>
          <Text className="text-black ml-4">
            {style.style}: {style.ascentCount} climbs (
            {Math.floor(100 * (style.successfulAttempts / style.ascentCount))}%
            success rate) )
          </Text>
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
          className="flex items-center rounded-md border border-input bg-red-800 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text className="text-white">Delete workout</Text>
        </TouchableOpacity>
        {/* </Link> */}
      </View>
    </SafeAreaView>
  );
};

export default WorkoutDetailsScreen;
