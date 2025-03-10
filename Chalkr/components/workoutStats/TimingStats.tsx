import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import useWorkout from "@/hooks/useWorkout";

export default function TimingStats({ id }: { id: number }) {
  const [workout, setWorkout] = useState<ClimbingWorkout>();
  const [duration, setDuration] = useState(0);
  const [climbingTime, setClimbingTime] = useState(0);
  const [restingTime, setRestingTime] = useState(0);
  const { fetchUniqueWorkout } = useWorkout();

  const workoutId = id;
  useEffect(() => {
    const fetchWorkout = async () => {
      const workout = await fetchUniqueWorkout(workoutId);
      if (!workout) {
        alert("error loading workout");
        return;
      }
      setWorkout(workout[0]);
      setDuration(workout[0].rest_time + workout[0].climb_time);
      setRestingTime(workout[0].rest_time);
      setClimbingTime(workout[0].climb_time);
    };

    fetchWorkout();
  }, [id]);

  return (
    <>
      <View className="flex flex-col justify-center">
        <Text className="text-black pb-2 ml-5 text-sm ">
          {workout?.timestamp}
        </Text>

        <Text className="text-black font-bold pt-4 ml-7 text-xl ">Timing</Text>
        <View>
          <View className="flex flex-row items-center  mb-0.5">
            <Text className="text-black pl-10 w-60 text-lg">Climb time</Text>
            <Text className="text-black w-24 text-lg">
              {climbingTime >= 3600 && (
                <>
                  {Math.floor(climbingTime / 360)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((climbingTime % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(climbingTime % 60).toString().padStart(2, "0")}
            </Text>
          </View>

          <View className="flex flex-row items-center mb-0.5">
            <Text className="text-black pl-10 w-60 text-lg">Rest time</Text>
            <Text className="text-black w-24 text-lg">
              {restingTime >= 3600 && (
                <>
                  {Math.floor(restingTime / 3600)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((restingTime % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(restingTime % 60).toString().padStart(2, "0")}
            </Text>
          </View>

          <View className="flex flex-row mb-0.5 text-lg">
            <Text className="text-black font-semibold pl-10 w-60 text-lg">
              Total time
            </Text>
            <Text className="text-black font-semibold w-24 text-lg">
              {duration >= 3600 && (
                <>
                  {Math.floor(duration / 3600)
                    .toString()
                    .padStart(2, "0")}
                  :
                </>
              )}
              {Math.floor((duration % 3600) / 60)
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
