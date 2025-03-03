// app/workoutDetails/[id]/lists.tsx
import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
export default function ListsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Lists for Workout ID: {id}</Text>
      {/* Your list content here */}
    </View>
  );
}
