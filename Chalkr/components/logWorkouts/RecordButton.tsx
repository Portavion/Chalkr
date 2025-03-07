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
      <TouchableOpacity testID="record-button" onPress={handleRecord}>
        {!isClimbing ? (
          <Ionicons
            testID="radio-button-on"
            name="radio-button-on"
            size={64}
            color={"#ffba00"}
          />
        ) : (
          <View>
            <View>
              <Ionicons
                testID="radio-button-off"
                name="radio-button-off"
                size={64}
                color={"#ffba00"}
              />
            </View>
            <View className="absolute left-1/4 top-1/4">
              <Ionicons
                testID="square-icon"
                name="square"
                size={32}
                color={"#ffba00"}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
