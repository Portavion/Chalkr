import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActionSheetIOS,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";

export default function WorkoutScreen() {
  const [grade, setGrade] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<ClimbingStyle>();
  const [isClimbing, setIsClimbing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleIncrement = () => {
    setGrade(grade + 1);
  };

  const handleDecrement = () => {
    if (grade > 0) {
      setGrade(grade - 1);
    }
  };

  const handleRecord = () => {
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true);
    }
    if (isClimbing) {
      setShowModal(true);
    }
    setIsClimbing(!isClimbing);
    setTimer(0);
  };

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Slab", "Dyno", "Overhang", "Traverse", "Cave"],
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          setSelectedStyle("slab");
        } else if (buttonIndex === 1) {
          setSelectedStyle("dyno");
        } else if (buttonIndex === 2) {
          setSelectedStyle("overhang");
        } else if (buttonIndex === 3) {
          setSelectedStyle("traverse");
        } else if (buttonIndex === 4) {
          setSelectedStyle("cave");
        }
      },
    );
  };

  useEffect(() => {
    if (isWorkoutStarted) {
      const id = setInterval(() => {
        setTimer((c) => c + 1);
      }, 1000);
      return () => {
        if (isWorkoutStarted) {
          clearInterval(id);
        }
      };
    }
  }, [isWorkoutStarted, isClimbing]);

  useEffect(() => {
    if (isWorkoutStarted) {
      const idWorkout = setInterval(() => {
        setWorkoutTimer((c) => c + 1);
      }, 1000);
      return () => {
        if (isWorkoutStarted) {
          clearInterval(idWorkout);
        }
      };
    }
  }, [isWorkoutStarted]);

  return (
    <View className="flex flex-1 justify-center items-center">
      {/* Grade component */}
      <View className="flex flex-row justify-center items-center mb-10">
        <Text className="mr-8">Grade: </Text>
        <TouchableOpacity onPress={handleDecrement}>
          <Ionicons name="remove-circle-outline" size={32} className="mr-3" />
        </TouchableOpacity>
        <Text className="">V{grade}</Text>
        <TouchableOpacity onPress={handleIncrement}>
          <Ionicons name="add-circle-outline" size={32} className="ml-3" />
        </TouchableOpacity>
      </View>
      {/* Climbing Style component */}
      <View className="flex flex-row justify-center items-center mb-10">
        <Text className="mr-8">Style : </Text>
        <TouchableOpacity
          onPress={showActionSheet}
          className="flex h-9 w-1/4 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text>{selectedStyle}</Text>
          <Ionicons name="chevron-down-sharp" />
        </TouchableOpacity>
      </View>
      {/*  timer */}
      <View className="absolute flex-row bottom-32 ">
        <View className="" style={{ width: 80 }}>
          <Text className="">{!isClimbing ? "Resting" : "Climbing"} : </Text>
        </View>
        <View className="w-15 flex-row justify-center">
          <Text>
            {Math.floor(timer / 60)
              .toString()
              .padStart(2, "0") +
              ":" +
              (timer % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
      {/* Record / stop button */}
      <View className="absolute bottom-11">
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
      {/* workout timer */}
      <View className="absolute flex-row bottom-4">
        <View className="" style={{ width: 120 }}>
          <Text className="">Total workout:</Text>
        </View>
        <View className="w-15 flex-row justify-center">
          <Text>
            {Math.floor(workoutTimer / (60 * 60))
              .toString()
              .padStart(2, "0") +
              ":" +
              Math.floor(workoutTimer / 60)
                .toString()
                .padStart(2, "0") +
              ":" +
              (workoutTimer % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
      {/* Logging modal */}
      {showModal && (
        <Modal animationType="slide" transparent={true} visible={showModal}>
          <BlurView
            intensity={20}
            className="flex-1 justify-center items-center"
          >
            <View className="bg-white border rounded-xl">
              <View className="flex justify-center content-center items-center my-5 mx-5 ">
                <Text className="mb-5">Was your attempt successful?</Text>
                <View className="flex flex-row justify-around gap-10 items-center ">
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <Ionicons name="flash" size={32} color={"#FCD34D"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={32}
                      color={"#DC2626"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </Modal>
      )}
    </View>
  );
}
