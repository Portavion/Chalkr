import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { workoutsTable } from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default function TimingStats({ id }: { id: number }) {
  const [workout, setWorkout] = useState<ClimbingWorkout>();
  const [duration, setDuration] = useState(0);
  const [climbingTime, setClimbingTime] = useState(0);
  const [restingTime, setRestingTime] = useState(0);

  const workoutId = id;

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

    fetchWorkout();
  }, [id]);

  return (
    <>
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
    </>
  );
}
