import { Text, View, TouchableOpacity, ActionSheetIOS } from "react-native";
import { RouteColors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { WorkoutContext as WorkoutDetailsContext } from "@/app/_layout";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
import { useContext } from "react";
cssInterop(Image, { className: "style" });

export default function ColourSelector({
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
    <View className="flex flex-row justify-center items-center mb-0">
      <Text className="mr-1 text-lg">Colour:</Text>
      <TouchableOpacity
        testID="colour-button"
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showActionSheet((routeColour: RouteColour) =>
            dispatch({ type: "SET_ROUTE_COLOUR", payload: routeColour }),
          );
        }}
        className="flex h-fit w-fit flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">{state.routeColour}</Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
    </View>
  );
}

const showActionSheet = (
  setRouteColour: (routeColour: RouteColour) => void,
) => {
  const options: string[] = Object.keys(RouteColors);
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      userInterfaceStyle: "light",
    },
    (buttonIndex) => {
      if (buttonIndex >= 0 && buttonIndex < options.length) {
        setRouteColour(options[buttonIndex] as RouteColour);
      }
    },
  );
};
