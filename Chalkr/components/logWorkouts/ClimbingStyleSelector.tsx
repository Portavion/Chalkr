import { Text, View, TouchableOpacity, ActionSheetIOS } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { WorkoutContext as WorkoutDetailsContext } from "@/app/_layout";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
import { useContext } from "react";
cssInterop(Image, { className: "style" });

export default function ClimbingStyleSelector({
  contextType,
}: {
  contextType: ContextType;
}) {
  let context;
  if (contextType === "workoutLog") {
    context = useContext(WorkoutLogContext);
  } else if (contextType === "workoutStats") {
    context = useContext(WorkoutDetailsContext);
  } else {
    throw new Error("Invalid contextType prop");
  }
  if (!context) {
    throw new Error(
      "GradeSelector must be used within a WorkoutContext Provider",
    );
  }
  const { state, dispatch } = context;
  return (
    <View className="flex flex-row justify-center items-center my-2">
      <Text className="mr-2 text-lg">Style: </Text>
      <TouchableOpacity
        testID="climbing-style-button"
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showActionSheet((climbingStyle) =>
            dispatch({ type: "SET_SELECTED_STYLE", payload: climbingStyle }),
          );
        }}
        className="flex h-fit w-fit flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">{state.selectedStyle}</Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
    </View>
  );
}
const showActionSheet = (
  setSelectedStyle: (climbingStyle: ClimbingStyle) => void,
) => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: [
        "Board",
        "Cave",
        "Dyno",
        "Overhang",
        "Slab",
        "Traverse",
        "Other",
      ],
      userInterfaceStyle: "light",
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        setSelectedStyle("board");
      } else if (buttonIndex === 1) {
        setSelectedStyle("cave");
      } else if (buttonIndex === 2) {
        setSelectedStyle("dyno");
      } else if (buttonIndex === 3) {
        setSelectedStyle("overhang");
      } else if (buttonIndex === 4) {
        setSelectedStyle("slab");
      } else if (buttonIndex === 5) {
        setSelectedStyle("traverse");
      } else {
        setSelectedStyle("other");
      }
    },
  );
};
