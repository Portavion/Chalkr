import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import useWorkout from "@/hooks/useWorkout";

export default function StyleDistribution({ id }: { id: number }) {
  const [styleDistribution, setStyleDistribution] = useState<
    {
      style: string | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();

  const { fetchWorkoutStyleDistribution } = useWorkout();
  const workoutId = id;

  useEffect(() => {
    const fetchAscentsStats = async () => {
      const styleDistributionData =
        await fetchWorkoutStyleDistribution(workoutId);
      setStyleDistribution(styleDistributionData);
    };

    fetchAscentsStats();
  }, [id]);

  return (
    <>
      <Text className="text-black font-bold pt-4 ml-7 text-xl ">Styles</Text>
      {styleDistribution?.map((style) => (
        <View key={String(style.style)}>
          <View>
            <View className="flex flex-row items-center mb-0.5 text-lg">
              <Text className="text-black pl-10 w-60 text-lg">
                {style.style}: {style.ascentCount} climbs
              </Text>
              <Text className="text-black  w-60 text-lg">
                {Math.floor(
                  100 * (style.successfulAttempts / style.ascentCount),
                )}
                %
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}
