import { Text, View, TouchableOpacity } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function StopWorkoutButton({
  handleStopWorkout,
}: {
  handleStopWorkout: () => void;
}) {
  return (
    <>
      <View className="absolute bottom-3">
        <TouchableOpacity
          onPress={handleStopWorkout}
          className="flex h-9 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text>Stop the workout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
