import { Text, View, TouchableOpacity, ActionSheetIOS } from "react-native";
import { BoulderColors } from "@/constants/Colors"; // Import boulderColors
import Ionicons from "@expo/vector-icons/Ionicons";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function ColourSelector({
  boulderColour,
  setBoulderColour,
}: {
  boulderColour: BoulderColour | "";
  setBoulderColour: React.Dispatch<React.SetStateAction<BoulderColour | "">>;
}) {
  return (
    <View className="flex flex-row justify-center items-center mb-0">
      <Text className="mr-1 text-lg">Colour:</Text>
      <TouchableOpacity
        onPress={() => showActionSheet(setBoulderColour)}
        className="flex h-fit w-fit flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">{boulderColour}</Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
    </View>
  );
}
const showActionSheet = (
  setBoulderColour: React.Dispatch<React.SetStateAction<BoulderColour | "">>,
) => {
  const options: string[] = Object.keys(BoulderColors);
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      userInterfaceStyle: "light",
    },
    (buttonIndex) => {
      if (buttonIndex >= 0 && buttonIndex < options.length) {
        setBoulderColour(options[buttonIndex] as BoulderColour);
      }
    },
  );
};
