import { Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export default function AboutScreen() {
  const { user, loading } = useUser();

  if (!user) {
    return <Text>Error, you need to be logged. </Text>;
  }
  return (
    <View className="flex flex-1 bg-slate-800 justify-center items-center">
      <Text className="text-white">Setting screen</Text>
      <Button
        title="Sign Out"
        onPress={async () => {
          await AsyncStorage.removeItem("@user");
          await signOut(FIREBASE_AUTH);
        }}
      />
    </View>
  );
}
