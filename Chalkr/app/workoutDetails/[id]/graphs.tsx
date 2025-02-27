// app/workoutDetails/[id]/graphs.tsx
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function GraphsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Graphs for Workout ID: {id}</Text>
      {/* Your graph content here */}
    </View>
  );
}
