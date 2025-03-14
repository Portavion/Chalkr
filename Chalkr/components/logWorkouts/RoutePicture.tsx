import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/route.png";
import { useContext, useEffect, useState } from "react";
import RouteSelectionModal from "./RouteSelectionModal";
import usePhoto from "@/hooks/usePhoto";

import { WorkoutContext as WorkoutDetailsContext } from "@/app/_layout";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";

import { GradeColour, RouteColors } from "@/constants/Colors";

export default function RoutePicture({
  canCreate = true,
  contextType,
}: {
  canCreate?: Readonly<boolean>;
  contextType: Readonly<ContextType>;
}) {
  let context;
  const [isLoading, setIsLoading] = useState(false); // Add loading state

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
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [gradeColour, setGradeColour] = useState("red");

  const { pickPhotoAsync } = usePhoto();

  useEffect(() => {
    if (state.routeColour !== "") {
      setGradeColour(RouteColors[state.routeColour]);
    } else {
      setGradeColour(GradeColour[state.grade] || "black");
    }
  }, [state.grade, state.routeColour]);

  const handleTakePhoto = async () => {
    setIsLoading(true); // Start loading
    const images = await pickPhotoAsync();

    if (!images?.imageFullPath || !images?.thumbnailFullPath) {
      alert("Error loading photo");
      return;
    }
    dispatch({ type: "SET_ROUTE_IMG", payload: images.imageFullPath });
    dispatch({
      type: "SET_ROUTE_THUMBNAIL",
      payload: images.thumbnailFullPath,
    });

    setIsLoading(false); // Stop loading (success case)
    const routes = state.routes;
    if (!routes) {
      return;
    }
    const updatedRoutes: Route[] = routes.map((route) => {
      return route.id === state.routeId
        ? {
            ...route,
            photoUrl: images.imageFullPath,
            thumbnail_url: images.thumbnailFullPath,
          }
        : route;
    });
    dispatch({ type: "SET_ROUTES", payload: updatedRoutes });
  };

  return (
    <>
      <View className="flex items-center">
        {!(state.routeColour === "VB") && (
          <View
            testID="route-image-container"
            style={{
              borderRadius: 16,
              borderWidth: 5,
              borderColor: gradeColour,
            }}
          >
            {/* need to check for fullimage being null or including ImageManipulator to avoid loading old images saved in the cache that could have been deleted since */}
            <Image
              source={
                state.routeImg === null
                  ? state.routeThumbnail || PlaceholderImage
                  : state.routeImg.includes("ImageManipulator")
                    ? state.routeThumbnail || PlaceholderImage
                    : state.routeImg
              }
              key={state.routeImg}
              testID="route-image"
              className="w-[250px] h-[400px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
            />
            {isLoading && (
              <View className="absolute top-0 left-0 w-[250px] h-[400px] rounded-xl bg-black/50 justify-center items-center">
                <ActivityIndicator size="large" color={"white"} />
              </View>
            )}
          </View>
        )}
        {state.routeColour === "VB" && (
          <View
            style={{
              backgroundColor: "black",
              borderRadius: 16,
              borderWidth: 5,
              borderColor: "yellow",
              borderStyle: "dashed",
            }}
          >
            <Image
              source={
                state.routeImg === null
                  ? state.routeThumbnail || PlaceholderImage
                  : state.routeImg.includes("ImageManipulator")
                    ? state.routeThumbnail || PlaceholderImage
                    : state.routeImg
              }
              key={state.routeImg}
              className="w-[250px] h-[400px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
            />
            {isLoading && (
              <View className="absolute top-0 left-0 w-[250px] h-[400px] rounded-xl bg-black/50 justify-center items-center">
                <ActivityIndicator size="large" color={"white"} />
              </View>
            )}
          </View>
        )}
        <View className="flex flex-row items-center gap-5">
          {canCreate && (
            <>
              <TouchableOpacity
                testID="select-route-button"
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  setShowSelectionModal(true);
                }}
                className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
              >
                <Text className="">Select route</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="new-route-button"
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  dispatch({ type: "SET_ROUTE_ID", payload: 0 });
                  handleTakePhoto();
                }}
                className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
              >
                <Text className="">New route</Text>
              </TouchableOpacity>
            </>
          )}
          {!canCreate && (
            <TouchableOpacity
              testID="new-photo-button"
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                handleTakePhoto();
              }}
              className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
            >
              <Text className="">New photo</Text>
            </TouchableOpacity>
          )}
        </View>
        {showSelectionModal && (
          <RouteSelectionModal
            showSelectionModal={true}
            setShowSelectionModal={setShowSelectionModal}
          />
        )}
      </View>
    </>
  );
}
