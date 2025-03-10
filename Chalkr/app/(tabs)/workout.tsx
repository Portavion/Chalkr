import { View } from "react-native";
import { useState, useEffect, useRef } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import * as Haptics from "expo-haptics";

import AscentStats from "@/components/workoutStats/AscentStats";
import useWorkout from "@/hooks/useWorkout";

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
import useAppStateTimer from "@/hooks/useAppStateTimer";
import useWorkoutTimer from "@/hooks/useWorkoutTimer";
import useAscents from "@/hooks/useAscents";

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

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [routeImg, setRouteImg] = useState<null | string>(null);
  const [routeId, setRouteId] = useState<number | undefined>();

  const { workoutId, createNewWorkout, updateWorkoutTimer } = useWorkout();

  const { logAscent, updateAscentRestTime } = useAscents();

  const handleRecord = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true);
      setSectionTimer(0);
      await createNewWorkout();
    }
    if (isClimbing) {
      setShowModal(true);
    } else {
      updateAscentRestTime(sectionTimer || 0);
    }
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

  useEffect(() => {
    isWorkoutStartedRef.current = isWorkoutStarted;
  }, [isWorkoutStarted]);

  useAppStateTimer(setSectionTimer, setWorkoutTimer, isWorkoutStartedRef);
  useWorkoutTimer(
    sectionTimer,
    setSectionTimer,
    setWorkoutTimer,
    isWorkoutStartedRef,
  );

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
