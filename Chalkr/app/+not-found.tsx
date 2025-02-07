import { View } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View className="flex flex-1 bg-slate-800 justify-center items-center">
        <Link href="/" className="text-xl underline text-white">
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}
