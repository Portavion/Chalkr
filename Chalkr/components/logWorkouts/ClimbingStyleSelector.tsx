import { Text, View, TouchableOpacity, ActionSheetIOS } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function ClimbingStyleSelector({
  selectedStyle,
  setSelectedStyle,
}: {
  selectedStyle: string;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View className="flex flex-row justify-center items-center mb-2">
      <Text className="mr-8 text-lg">Style : </Text>
      <TouchableOpacity
        onPress={() => showActionSheet(setSelectedStyle)}
        className="flex h-fit w-fit flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">{selectedStyle}</Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
    </View>
  );
}
const showActionSheet = (
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>,
) => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Slab", "Dyno", "Overhang", "Traverse", "Cave", "Other"],
      userInterfaceStyle: "dark",
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        setSelectedStyle("slab");
      } else if (buttonIndex === 1) {
        setSelectedStyle("dyno");
      } else if (buttonIndex === 2) {
        setSelectedStyle("overhang");
      } else if (buttonIndex === 3) {
        setSelectedStyle("traverse");
      } else if (buttonIndex === 4) {
        setSelectedStyle("cave");
      } else {
        setSelectedStyle("other");
      }
    },
  );
};
