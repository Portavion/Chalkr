import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import GradeSelector from "@/components/logWorkouts/GradeSelector/GradeSelector";
import { differenceInSeconds } from "date-fns";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AscentStats from "@/components/workoutStats/AscentStats";
import useWorkoutData from "@/hooks/useWorkoutData";

import * as ImagePicker from "expo-image-picker";

import StopWorkoutButton from "@/components/logWorkouts/StopWorkoutButton";
import ProblemPicture from "@/components/logWorkouts/ProblemPicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import WorkoutTimer from "@/components/logWorkouts/WorkoutTimer";
import WorkoutSectionTimer from "@/components/logWorkouts/WorkoutSectionTimer";
import RecordButton from "@/components/logWorkouts/RecordButton";
import LoggingModal from "@/components/logWorkouts/LoggingModal";

export default function WorkoutScreen() {
  const [grade, setGrade] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<ClimbingStyle>("other");
  const [isClimbing, setIsClimbing] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const [sectionTimer, setSectionTimer] = useState(0);
  const [lastTimer, setLastTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [boulderImg, setBoulderImg] = useState<undefined | string>();

  const {
    workoutId,
    createNewWorkout,
    logAscent,
    updateAscentRestTime,
    updateWorkoutTimer,
  } = useWorkoutData();

  const handleRecord = async () => {
    // starting the workout and initialising the new workout in the db
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true);
      recordStartTime();
      await createNewWorkout();
    }
    // showing the completion modal if finished climbing
    if (isClimbing) {
      setShowModal(true);
    } else {
      //we are not climbing so we can update the rest time of previous boulder
      updateAscentRestTime(sectionTimer);
    }
    // switch to rest / climbing mode and resets the rest or climbing timer
    setIsClimbing(!isClimbing);
    setLastTimer(sectionTimer);
    setSectionTimer(0);
  };

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);
    setRefresh(false);
    await logAscent(0, lastTimer, grade, isSuccess, selectedStyle);
    setRefresh(true);
  };

  const handleStopWorkout = async () => {
    if (isClimbing) {
      alert("finish logging the current climb first");
    } else {
      await updateAscentRestTime(sectionTimer);

      await updateWorkoutTimer();

      setIsWorkoutStarted(false);
      setBoulderImg(undefined);
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

  const pickImageAsync = async () => {
    let result;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access the camera is required!");
      return;
    }
    try {
      result = await ImagePicker.launchCameraAsync({});
    } catch (error) {}

    if (!result?.canceled) {
      setBoulderImg(result?.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View className="flex flex-auto mt-2 items-center">
      {isWorkoutStarted && (
        <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
      )}

      <ProblemPicture
        boulderPhotoUri={boulderImg}
        pickPhotoAsync={pickImageAsync}
      />

      <View className="translate-x-20">
        <AscentStats
          id={workoutId}
          refresh={refresh}
          reset={!isWorkoutStarted}
          size={"small"}
        />
      </View>

      <GradeSelector grade={grade} setGrade={setGrade} />

      <ClimbingStyleSelector
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />

      <WorkoutSectionTimer
        isClimbing={isClimbing}
        sectionTimer={sectionTimer}
      />

      <RecordButton handleRecord={handleRecord} isClimbing={isClimbing} />

      <WorkoutTimer workoutTimer={workoutTimer} />

      {showModal && (
        <LoggingModal
          boulderPhotoUri={boulderImg}
          pickPhotoAsync={pickImageAsync}
          handleAscentLog={handleAscentLog}
          showModal={showModal}
          grade={grade}
          setGrade={setGrade}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />
      )}
    </View>
  );
}
