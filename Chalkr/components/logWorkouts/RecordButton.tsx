import { View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RecordButton({
  handleRecord,
  isClimbing,
}: {
  handleRecord: () => void;
  isClimbing: boolean;
}) {
  return (
    <View className="absolute bottom-20">
      <TouchableOpacity onPress={handleRecord}>
        {!isClimbing ? (
          <Ionicons name="radio-button-on" size={64} color={"orange"} />
        ) : (
          <View>
            <View>
              <Ionicons name="radio-button-off" size={64} color={"orange"} />
            </View>
            <View className="absolute left-1/4 top-1/4">
              <Ionicons name="square" size={32} color={"orange"} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
