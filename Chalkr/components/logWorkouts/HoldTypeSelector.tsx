import { Text, View, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import React, { useContext, useState } from "react";
import { WorkoutContext as WorkoutDetailsContext } from "@/app/_layout";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
cssInterop(Image, { className: "style" });

export default function HoldTypeSelector({
  contextType,
}: {
  contextType: DeepReadonly<ContextType>;
}) {
  let context;
  if (contextType === "workoutLog") {
    context = useContext(WorkoutLogContext);
  } else if (contextType === "workoutStats") {
    context = useContext(WorkoutDetailsContext);
  } else {
    throw new Error("Invalid contextType prop");
  }
  if (!context) {
    throw new Error(
      "GradeSelector must be used within a WorkoutContext Provider",
    );
  }
  const { state, dispatch } = context;
  const [showHoldModal, setShowHoldModal] = useState(false);
  const holdTypes: HoldType[] = [
    "Crimp",
    "Jug",
    "Slopper",
    "Pocket",
    "Pinch",
    "Sidepull",
    "Gaston",
    "Undercling",
  ];

  return (
    <View className="flex flex-row justify-center items-center ">
      <Text className="mr-2 text-lg">Holds: </Text>
      <TouchableOpacity
        testID="hold-button"
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowHoldModal(true);
        }}
        className="flex h-10 w-48 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">
          {state.selectHoldTypes.length <= 1
            ? state.selectHoldTypes[0]
            : state.selectHoldTypes.length > 2
              ? state.selectHoldTypes[0] +
                ", " +
                state.selectHoldTypes[1] +
                ", ..."
              : state.selectHoldTypes[0] + ", " + state.selectHoldTypes[1]}
        </Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
      {showHoldModal && (
        <Modal animationType="slide" transparent={true} visible={showHoldModal}>
          <BlurView
            intensity={20}
            className="flex-1 justify-center items-center"
          >
            <View className="bg-stone-200 border border-stone-500 pt-2 rounded-xl">
              <View className="flex justify-center content-center items-center mb-5 mt-2 mx-5 ">
                <Text className="mb-4 text-xl font-bold">Hold Types</Text>
                <View className="flex flex-col items-start  mx-5 ">
                  {holdTypes.map((holdType) => {
                    return (
                      <View
                        key={holdType}
                        className="flex flex-row justify-center content-center gap-2 items-center mb-5 mx-5 "
                      >
                        <Checkbox
                          value={state.selectHoldTypes.includes(holdType)}
                          testID={`checkbox-${holdType}`}
                          onValueChange={() => {
                            Haptics.selectionAsync();
                            state.selectHoldTypes.includes(holdType);
                            if (state.selectHoldTypes.includes(holdType)) {
                              dispatch({
                                type: "SET_SELECTED_HOLD_TYPES",
                                payload: state.selectHoldTypes.filter(
                                  (ht) => ht !== holdType,
                                ),
                              });
                            } else {
                              dispatch({
                                type: "SET_SELECTED_HOLD_TYPES",
                                payload: [...state.selectHoldTypes, holdType],
                              });
                            }
                          }}
                        />
                        <Text className="text-lg">{holdType}</Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    setShowHoldModal(false);
                  }}
                >
                  <Text className="flex items-center rounded-md border border-amber-400 bg-amber-200 text-xl px-2 py-2">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
      )}
    </View>
  );
}
