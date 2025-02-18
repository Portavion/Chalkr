import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActionSheetIOS,
  AppState,
  AppStateStatus,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import GradeSelector from "@/components/logWorkouts/GradeSelector/GradeSelector";
import { differenceInSeconds } from "date-fns";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq, inArray, sum } from "drizzle-orm";
import AsyncStorage from "@react-native-async-storage/async-storage";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default function WorkoutScreen() {
  const [grade, setGrade] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<ClimbingStyle>("");
  const [isClimbing, setIsClimbing] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const [sectionTimer, setSectionTimer] = useState(0);
  const [lastTimer, setLastTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [workoutId, setWorkoutId] = useState(0);
  const [lastAscentId, setLastAscentId] = useState<number>(0);

  const handleRecord = async () => {
    // starting the workout and initialising the new workout in the db
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true);
      recordStartTime();
      try {
        const newWorkout = await db
          .insert(workoutsTable)
          .values([{}])
          .returning();
        setWorkoutId(newWorkout[0].id);
      } catch (error) {
        alert("Couldn't create workout");
      }
    }
    // showing the completion modal if finished climbing
    if (isClimbing) {
      setShowModal(true);
    } else {
      //we are not climbing so we can update the rest time of previous boulder
      handleRestTimeLog();
    }
    // switch to rest / climbing mode and resets the rest or climbing timer
    setIsClimbing(!isClimbing);
    setLastTimer(sectionTimer);
    setSectionTimer(0);
  };

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);

    const addedAscent = await db
      .insert(ascentsTable)
      .values({
        boulder_id: 0,
        ascentTime: lastTimer,
        grade: grade,
        isSuccess: isSuccess,
        style: selectedStyle,
      })
      .returning();

    setLastAscentId(addedAscent[0].id);

    const addedWorkoutAscent = await db
      .insert(workoutAscentTable)
      .values({
        workout_id: workoutId,
        ascent_id: addedAscent[0].id,
      })
      .returning();
  };

  const handleRestTimeLog = async () => {
    await db
      .update(ascentsTable)
      .set({ restTime: lastTimer })
      .where(eq(ascentsTable.id, lastAscentId))
      .returning();
  };

  const handleStopWorkout = async () => {
    if (isClimbing) {
      alert("finish logging the current climb first");
    } else {
      handleRestTimeLog();

      const workoutAscents = await db
        .selectDistinct({ id: workoutAscentTable.ascent_id })
        .from(workoutAscentTable)
        .where(eq(workoutAscentTable.workout_id, workoutId));

      const workoutAscentIds = workoutAscents
        .map((ascent) => ascent?.id)
        .filter((id): id is number => id !== null && id !== undefined);

      const sumClimbTime = await db
        .select({
          total: sum(ascentsTable.ascentTime),
        })
        .from(ascentsTable)
        .where(inArray(ascentsTable.id, workoutAscentIds));

      const sumRestTime = await db
        .select({
          total: sum(ascentsTable.restTime),
        })
        .from(ascentsTable)
        .where(inArray(ascentsTable.id, workoutAscentIds));

      const totalClimbTime = sumClimbTime[0]?.total || 0;
      const totalRestTime = sumRestTime[0]?.total || 0;

      await db
        .update(workoutsTable)
        .set({
          climb_time: Number(totalClimbTime),
          //TODO: sum the total rest time and ascending time
          rest_time: Number(totalRestTime),
        })
        .where(eq(workoutsTable.id, workoutId))
        .returning();

      setIsWorkoutStarted(false);
      setSectionTimer(0);
      setIsClimbing(false);
      setWorkoutTimer(0);
    }
  };

  const recordStartTime = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem("@start_time", now.toISOString());
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      const now = new Date();
      if (startTime) {
        return differenceInSeconds(now, Date.parse(startTime));
      } else {
        return 0;
      }
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  useEffect(() => {
    if (isWorkoutStarted) {
      const id = setInterval(() => {
        if (elapsed !== 0) {
          setSectionTimer((c) => c + elapsed);
          setWorkoutTimer((c) => c + elapsed);
          setElapsed(0);
        }
        setSectionTimer((c) => c + 1);
        setWorkoutTimer((c) => c + 1);
      }, 1000);
      return () => {
        if (isWorkoutStarted) {
          clearInterval(id);
        }
      };
    }
  }, [isWorkoutStarted]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // We just became active again: recalculate elapsed time based
      // on what we stored in AsyncStorage when we started.
      const elapsed = await getElapsedTime(); // Update the elapsed seconds state
      if (elapsed) {
        setElapsed(elapsed);
      }
    }
    appState.current = nextAppState;
  };

  return (
    <View className="flex flex-1 justify-center items-center">
      {/* Stop workout component */}
      {isWorkoutStarted && (
        <View className="absolute bottom-3">
          <TouchableOpacity
            onPress={handleStopWorkout}
            className="flex h-9 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          >
            <Text>Stop the workout</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Grade component */}
      <GradeSelector grade={grade} setGrade={setGrade} />
      {/* Climbing Style component */}
      <View className="flex flex-row justify-center items-center mb-10">
        <Text className="mr-8">Style : </Text>
        <TouchableOpacity
          onPress={() => showActionSheet(setSelectedStyle)}
          className="flex h-9 w-1/4 flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text>{selectedStyle}</Text>
          <Ionicons name="chevron-down-sharp" />
        </TouchableOpacity>
      </View>
      {/*  timer */}
      <View className="absolute flex-row bottom-40 ">
        <View className="" style={{ width: 80 }}>
          <Text className="">{!isClimbing ? "Resting" : "Climbing"} : </Text>
        </View>
        <View className="w-15 flex-row justify-center">
          <Text>
            {Math.floor(sectionTimer / 60)
              .toString()
              .padStart(2, "0") +
              ":" +
              (sectionTimer % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
      {/* Record / stop button */}
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
      {/* workout timer */}
      <View className="absolute flex-row bottom-14">
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
                    onPress={() => {
                      handleAscentLog(false);
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

const showActionSheet = (
  setSelectedStyle: React.Dispatch<React.SetStateAction<ClimbingStyle>>,
) => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Slab", "Dyno", "Overhang", "Traverse", "Cave", ""],
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
      } else {
        setSelectedStyle("");
      }
    },
  );
};
