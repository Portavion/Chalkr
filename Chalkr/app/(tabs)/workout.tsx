import { View, AppState, AppStateStatus } from "react-native";
import { useState, useEffect, useRef } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector/GradeSelector";
import { differenceInSeconds, formatISO9075 } from "date-fns";

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
import React from "react";

export default function WorkoutScreen() {
  const [grade, setGrade] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string>("other");
  const [isClimbing, setIsClimbing] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const isWorkoutStartedRef = useRef(isWorkoutStarted);

  const [sectionTimer, setSectionTimer] = useState<number>();
  const [lastTimer, setLastTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const appState = useRef(AppState.currentState);

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [boulderImg, setBoulderImg] = useState<null | string>(null);
  const [boulderId, setBoulderId] = useState<number | undefined>();

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
      setSectionTimer(0);
      recordStartTime();
      await createNewWorkout();
    }
    // showing the completion modal if finished climbing
    if (isClimbing) {
      setShowModal(true);
    } else {
      //we are not climbing so we can update the rest time of previous boulder
      updateAscentRestTime(sectionTimer || 0);
    }
    // switch to rest / climbing mode and resets the rest or climbing timer
    setIsClimbing(!isClimbing);
    setLastTimer(sectionTimer || 0);
    setSectionTimer(0);
  };

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);
    setRefresh(false);
    const problem = await logAscent(
      boulderId || 0,
      lastTimer,
      grade,
      isSuccess,
      selectedStyle,
      boulderImg,
    );
    if (!problem) {
      setBoulderId(0);
    } else {
      setBoulderId(problem.id);
    }
    // setBoulderId(problem.id ? problem.id : 0);
    setRefresh(true);
  };

  const handleStopWorkout = async () => {
    if (isClimbing) {
      alert("finish logging the current climb first");
    } else {
      await updateAscentRestTime(sectionTimer || 0);

      await updateWorkoutTimer();

      setIsWorkoutStarted(false);
      setBoulderImg(null);
      setSectionTimer(undefined);
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
        setSectionTimer((c) => (c || 0) + 1);
        setWorkoutTimer((c) => c + 1);
      }, 1000);
      return () => {
        if (isWorkoutStarted) {
          clearInterval(id);
        }
      };
    }
  }, [sectionTimer]);

  useEffect(() => {
    isWorkoutStartedRef.current = isWorkoutStarted;
  }, [isWorkoutStarted]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      recordStartTime();
    }
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // We just became active again: recalculate elapsed time based
      // on what we stored in AsyncStorage when we started.
      //
      const elapsed = await getElapsedTime(); // Update the elapsed seconds state
      if (elapsed && isWorkoutStartedRef.current) {
        setSectionTimer((c) => (c || 0) + elapsed);
        setWorkoutTimer((c) => c + elapsed);
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const pickImageAsync = async () => {
    let result;
    setBoulderId(0);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access the camera is required!");
      return;
    }
    try {
      result = await ImagePicker.launchCameraAsync({
        quality: 0,
        base64: false,
      });
    } catch (error) {}

    if (!result?.canceled && result) {
      setBoulderImg(result?.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View className="flex flex-auto pt-2 items-center bg-stone-300">
      {isWorkoutStarted && (
        <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
      )}

      <ProblemPicture
        boulderPhotoUri={boulderImg}
        pickPhotoAsync={pickImageAsync}
        setBoulderId={setBoulderId}
        setBoulderImg={setBoulderImg}
        setGrade={setGrade}
        setStyle={setSelectedStyle}
        grade={grade}
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
        sectionTimer={sectionTimer || 0}
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
          setBoulderId={setBoulderId}
          setBoulderImg={setBoulderImg}
        />
      )}
    </View>
  );
}
