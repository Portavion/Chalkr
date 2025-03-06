import { Text, View } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function WorkoutSectionTimer({
  isClimbing,
  sectionTimer,
}: {
  isClimbing: boolean;
  sectionTimer: number;
}) {
  return (
    <>
      <View className="absolute flex-row bottom-40">
        <View className="" style={{ width: 80 }}>
          <Text className="text-lg">
            {!isClimbing ? "Resting" : "Climbing"}:{" "}
          </Text>
        </View>
        <View className="w-15 flex-row justify-center">
          <Text className="text-lg">
            {Math.floor(sectionTimer / 60)
              .toString()
              .padStart(2, "0") +
              ":" +
              (sectionTimer % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
    </>
  );
}
