import { Text, View, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import useWorkoutData from "@/hooks/useWorkoutData";
import { Link } from "expo-router";

export default function AboutScreen() {
  const { user, loading } = useUser();

  const { resetDb } = useWorkoutData();

  if (!user) {
    return <Text>Error, you need to be logged. </Text>;
  }
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
        <Link href={`/problemView/problems`} asChild>
          <TouchableOpacity className="flex items-center rounded-md border border-amber-400 bg-amber-200 px-2 py-1 text-xs ">
            <Text className="text-black text-xl">View all problems</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
