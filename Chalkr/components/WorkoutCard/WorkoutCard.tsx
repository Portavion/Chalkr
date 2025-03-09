import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ListItem, Divider, Icon } from "@rneui/themed";
import { Link, router } from "expo-router";
import * as Haptics from "expo-haptics";

const WorkoutCard = ({
  workout,
  isExpanded,
  handlePress,
}: {
  workout: ClimbingWorkout;
  isExpanded: boolean;
  handlePress: (workoutId: number) => void;
}) => {
  const handleDetailsPress = () => {
    Haptics.selectionAsync();
    router.push(`/workoutDetails/${workout.id}`);
  };
  return (
    <View className="pb-6 flex flex-row justify-center items-center">
      <View className="bg-white rounded-xl p-5 shadow-sm w-2/3 h-auto justify-center items-center">
        <ListItem.Accordion
          content={
            <>
              <Text className="text-lg">
                {String(workout.timestamp).split(" ", 1)},{" "}
                {String(workout.timestamp).split(" ", 2)[1]}
              </Text>
            </>
          }
          isExpanded={isExpanded}
          icon={<Icon name={"chevron-down"} type="material-community" />}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handlePress(workout.id);
          }}
        >
          <View>
            <Text className="text-lg ">
              {Math.floor(Number(workout.climb_time + workout.rest_time) / 60)
                .toString()
                .padStart(2, "0")}
              :
              {Math.floor(Number(workout.climb_time + workout.rest_time) % 60)
                .toString()
                .padStart(2, "0")}
            </Text>
            <Text className="text-sm font-extralight">Total time </Text>
            <View className="flex flex-row my-4 content-between ">
              <View className="flex flex-col">
                <Divider style={{ width: "90%" }} width={1} />
                <Text className="text-lg mr-6">
                  {Math.floor(Number(workout.climb_time) / 60)
                    .toString()
                    .padStart(2, "0")}
                  :
                  {Math.floor(Number(workout.climb_time) % 60)
                    .toString()
                    .padStart(2, "0")}
                </Text>
                <Text className="text-sm  mr-6 font-extralight">
                  Climb time
                </Text>
              </View>
              <View className="flex flex-col">
                <Divider style={{ width: "90%" }} width={1} />
                <Text className="text-lg mr-6 ">
                  {Math.floor(Number(workout.rest_time) / 60)
                    .toString()
                    .padStart(2, "0")}
                  :
                  {Math.floor(Number(workout.rest_time) % 60)
                    .toString()
                    .padStart(2, "0")}
                </Text>
                <Text className="text-sm  mr-6 font-extralight">Rest time</Text>
              </View>
            </View>
          </View>
          <View className="flex items-center content-center">
            <TouchableOpacity
              id={`${workout.id}`}
              className="flex items-center rounded-md border border-amber-400 bg-amber-200 px-2 py-1 text-xs "
              onPress={() => {
                Haptics.selectionAsync;
                handleDetailsPress();
              }}
            >
              <Text className="text-black text-xs">details</Text>
            </TouchableOpacity>
          </View>
        </ListItem.Accordion>
      </View>
    </View>
  );
};

export default WorkoutCard;
