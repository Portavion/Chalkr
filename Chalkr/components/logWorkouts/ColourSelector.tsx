import { Text, View, TouchableOpacity, ActionSheetIOS } from "react-native";
import { RouteColors } from "@/constants/Colors"; // Import routeColors
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function ColourSelector({
  routeColour,
  setRouteColour,
}: {
  routeColour: RouteColour | "";
  setRouteColour: React.Dispatch<React.SetStateAction<RouteColour | "">>;
}) {
  return (
    <View className="flex flex-row justify-center items-center mb-0">
      <Text className="mr-1 text-lg">Colour:</Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          showActionSheet(setRouteColour);
        }}
        className="flex h-fit w-fit flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">{routeColour}</Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
    </View>
  );
}
const showActionSheet = (
  setRouteColour: React.Dispatch<React.SetStateAction<RouteColour | "">>,
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
