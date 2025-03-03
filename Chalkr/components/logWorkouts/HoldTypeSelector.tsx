import { Text, View, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
cssInterop(Image, { className: "style" });

export default function HoldTypeSelector({
  selectedHoldTypes,
  setSelectedHoldTypes,
}: {
  selectedHoldTypes: HoldType[];
  setSelectedHoldTypes: React.Dispatch<React.SetStateAction<HoldType[]>>;
}) {
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
    <View className="flex flex-row justify-center items-center mb-2">
      <Text className="mr-2 text-lg">Holds : </Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowHoldModal(true);
        }}
        className="flex h-10 w-48 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-slate-50 px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <Text className="text-lg text-center">
          {selectedHoldTypes.length <= 1
            ? selectedHoldTypes[0]
            : selectedHoldTypes.length > 2
              ? selectedHoldTypes[0] + ", " + selectedHoldTypes[1] + ", ..."
              : selectedHoldTypes[0] + ", " + selectedHoldTypes[1]}
        </Text>
        <Ionicons name="chevron-down-sharp" />
      </TouchableOpacity>
      {showHoldModal && (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showHoldModal}
          >
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
                            value={
                              selectedHoldTypes.includes(holdType)
                                ? true
                                : false
                            }
                            onValueChange={() => {
                              Haptics.selectionAsync();
                              selectedHoldTypes.includes(holdType)
                                ? setSelectedHoldTypes(
                                    selectedHoldTypes.filter(
                                      (ht) => ht !== holdType,
                                    ),
                                  )
                                : setSelectedHoldTypes([
                                    ...selectedHoldTypes,
                                    holdType,
                                  ]);
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
        </>
      )}
    </View>
  );
}
