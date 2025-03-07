import { View, AppState, AppStateStatus } from "react-native";
import { useState, useEffect, useRef } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import { differenceInSeconds } from "date-fns";
import * as Haptics from "expo-haptics";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AscentStats from "@/components/workoutStats/AscentStats";
import useWorkoutData from "@/hooks/useWorkoutData";

import StopWorkoutButton from "@/components/logWorkouts/StopWorkoutButton";
import RoutePicture from "@/components/logWorkouts/RoutePicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import WorkoutTimer from "@/components/logWorkouts/WorkoutTimer";
import WorkoutSectionTimer from "@/components/logWorkouts/WorkoutSectionTimer";
import RecordButton from "@/components/logWorkouts/RecordButton";
import LoggingModal from "@/components/logWorkouts/LoggingModal";
import React from "react";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";

export default function WorkoutScreen() {
  const [grade, setGrade] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string>("Other");
  const [selectHoldTypes, setSelectedHoldTypes] = useState<HoldType[]>([]);

  const [isClimbing, setIsClimbing] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const isWorkoutStartedRef = useRef(isWorkoutStarted);

  const [sectionTimer, setSectionTimer] = useState<number>();
  const [lastTimer, setLastTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [routes, setRoutes] = useState<Route[]>();
  const [routeThumbnail, setRouteThumbnail] = useState<null | string>(null);
  const [routeColour, setRouteColour] = useState<RouteColour | "">("");

  const appState = useRef(AppState.currentState);

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [routeImg, setRouteImg] = useState<null | string>(null);
  const [routeId, setRouteId] = useState<number | undefined>();

  const {
    workoutId,
    createNewWorkout,
    logAscent,
    updateAscentRestTime,
    updateWorkoutTimer,
  } = useWorkoutData();

  const handleRecord = async () => {
    // starting the workout and initialising the new workout in the db
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      //we are not climbing so we can update the rest time of previous route
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
    const route = await logAscent(
      routeId || 0,
      lastTimer,
      grade,
      isSuccess,
      selectedStyle,
      selectHoldTypes,
      routeColour,
      routeImg,
      routeThumbnail,
    );
    if (!route) {
      setRouteId(0);
    } else {
      setRouteId(route.id);
    }
    // setRouteId(route.id ? route.id : 0);
    setRefresh(true);
  };

  const handleStopWorkout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isClimbing) {
      alert("finish logging the current climb first");
    } else {
      await updateAscentRestTime(sectionTimer || 0);

      await updateWorkoutTimer();

      setIsWorkoutStarted(false);
      setRouteImg(null);
      setSectionTimer(undefined);
      setIsClimbing(false);
      setWorkoutTimer(0);
      setRouteColour("");
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
  return (
    <View className="flex flex-auto pt-2 items-center bg-stone-300">
      {isWorkoutStarted && (
        <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
      )}

      <RoutePicture
        routeId={routeId}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setGrade={setGrade}
        setStyle={setSelectedStyle}
        setSelectedHoldTypes={setSelectedHoldTypes}
        grade={grade}
        routeImg={routeImg}
        routeThumbnail={routeThumbnail}
        routeColour={routeColour}
        setRouteColour={setRouteColour}
        setRouteThumbnail={setRouteThumbnail}
        setRoutes={setRoutes}
      />

      <View className="translate-x-20">
        <AscentStats
          id={workoutId}
          refresh={refresh}
          reset={!isWorkoutStarted}
          size={"small"}
        />
      </View>

      <View className="flex flex-row gap-4 justify-center items-center">
        <GradeSelector grade={grade} setGrade={setGrade} />
        <ColourSelector
          routeColour={routeColour}
          setRouteColour={setRouteColour}
        />
      </View>

      <View className="flex flex-row gap-4 justify-center items-center">
        <ClimbingStyleSelector
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />

        <HoldTypeSelector
          selectedHoldTypes={selectHoldTypes}
          setSelectedHoldTypes={setSelectedHoldTypes}
        />
      </View>

      <WorkoutSectionTimer
        isClimbing={isClimbing}
        sectionTimer={sectionTimer || 0}
      />

      <RecordButton handleRecord={handleRecord} isClimbing={isClimbing} />

      <WorkoutTimer workoutTimer={workoutTimer} />

      {showModal && (
        <LoggingModal
          handleAscentLog={handleAscentLog}
          showModal={showModal}
          routeImg={routeImg}
          routeThumbnail={routeThumbnail}
          grade={grade}
          routeId={routeId}
          setGrade={setGrade}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          setRouteId={setRouteId}
          selectedHoldTypes={selectHoldTypes}
          setSelectedHoldTypes={setSelectedHoldTypes}
          setRouteImg={setRouteImg}
          setRoutes={setRoutes}
          setRouteThumbnail={setRouteThumbnail}
          routeColour={routeColour}
          setRouteColour={setRouteColour}
        />
      )}
    </View>
  );
}
