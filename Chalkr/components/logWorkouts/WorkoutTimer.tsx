import { Text, View } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function WorkoutSectionTimer({
  workoutTimer,
}: {
  workoutTimer: number;
}) {
  return (
    <>
      <View className="absolute flex-row bottom-32">
        <View className="" style={{ width: 120 }}>
          <Text className="text-lg">Total workout:</Text>
        </View>
        <View className="w-15 flex-row justify-center">
          <Text className="text-lg">
            {Math.floor(workoutTimer / (60 * 60))
              .toString()
              .padStart(2, "0") +
              ":" +
              Math.floor(workoutTimer / 60)
                .toString()
                .padStart(2, "0") +
              ":" +
              (workoutTimer % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
    </>
  );
}
