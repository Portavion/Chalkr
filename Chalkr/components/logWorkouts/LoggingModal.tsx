import { Modal, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import RoutePicture from "./RoutePicture";
import ClimbingStyleSelector from "./ClimbingStyleSelector";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import * as Haptics from "expo-haptics";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";
import { useContext } from "react";
import { WorkoutContext } from "@/context/WorkoutContext";

export default function LoggingModal({
  handleAscentLog,
  showModal,
}: {
  handleAscentLog: (isSuccess: boolean) => void;
  showModal: boolean;
}) {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RoutePicture must be used within a WorkoutContext Provider",
    );
  }
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <BlurView intensity={20} className="flex-1 justify-center items-center">
          <View className="bg-stone-200 border border-stone-500 pt-2 rounded-xl">
            <RoutePicture contextType="workoutLog" />
            <View className="flex flex-row gap-4 justify-center items-center">
              <GradeSelector />
              <ColourSelector />
            </View>
            <ClimbingStyleSelector />
            <HoldTypeSelector />

            <View className="flex justify-center content-center items-center mb-5 mx-5 ">
              <Text className="mb-2 text-lg">Was your attempt successful?</Text>
              <View className="flex flex-row justify-around gap-10 items-center ">
                <TouchableOpacity
                  testID="successful-button"
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    handleAscentLog(true);
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color={"green"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="unsuccessful-button"
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    handleAscentLog(false);
                  }}
                >
                  <Ionicons name="remove-circle" size={32} color={"#DC2626"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}
