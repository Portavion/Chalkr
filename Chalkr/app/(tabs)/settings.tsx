import { Text, View, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import useWorkout from "@/hooks/useWorkout";
import { Link } from "expo-router";
import * as Haptics from "expo-haptics";

export default function AboutScreen() {
  const { resetDb } = useWorkout();

  return (
    <View className="flex flex-1 justify-center items-center bg-stone-300">
      <Text className="text-black text-3xl">Settings screen</Text>
      <Button
        title="Sign Out"
        onPress={async () => {
          await AsyncStorage.removeItem("@user");
          await signOut(FIREBASE_AUTH);
        }}
      />
      <Button title="Reset DB" onPress={resetDb} />
      <View className="flex pt-28 items-center content-center">
        <Link href={`/routeView/routes`} asChild>
          <TouchableOpacity
            onPress={Haptics.selectionAsync}
            className="flex items-center rounded-md border border-amber-400 bg-amber-200 px-2 py-1 text-xs "
          >
            <Text className="text-black text-xl">View all routes</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
