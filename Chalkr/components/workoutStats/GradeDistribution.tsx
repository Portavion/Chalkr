import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import useWorkout from "@/hooks/useWorkout";

export default function GradeDistribution({ id }: { id: number }) {
  const [gradeDistribution, setGradeDistribution] = useState<
    {
      grade: number | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();
  const { fetchWorkoutGradeDistribution } = useWorkout();

  const workoutId = id;
  useEffect(() => {
    const fetchAscentsStats = async () => {
      const gradeDistributionData =
        await fetchWorkoutGradeDistribution(workoutId);
      setGradeDistribution(gradeDistributionData);
    };

    fetchAscentsStats();
  }, [id]);

  return (
    <>
      <Text className="text-black font-bold pt-4 ml-7 text-xl ">Grades</Text>
      {gradeDistribution?.map((grade) => (
        <View key={String(grade.grade)}>
          <View>
            <View className="flex flex-row items-center mb-0.5">
              <Text className="text-black pl-10 w-60 text-lg">
                V{grade.grade}: {grade.ascentCount} climbs
              </Text>
              <Text className="text-black  w-60 text-lg">
                {Math.floor(
                  100 * (grade.successfulAttempts / grade.ascentCount),
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
