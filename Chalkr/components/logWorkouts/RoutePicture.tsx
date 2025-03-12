import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/route.png";
import { useContext, useEffect, useState } from "react";
import RouteSelectionModal from "./RouteSelectionModal";

import usePhoto from "@/hooks/usePhoto";
import { WorkoutContext } from "@/app/(tabs)/workout";

export default function RoutePicture({
  canCreate = true,
}: {
  canCreate?: boolean;
}) {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RoutePicture must be used within a WorkoutContext Provider",
    );
  }

  const { state, dispatch } = context;

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [gradeColour, setGradeColour] = useState<RouteColour>("red");

  const { pickPhotoAsync } = usePhoto();

  useEffect(() => {
    if (state.routeColour !== "") {
      dispatch({ type: "SET_ROUTE_COLOUR", payload: state.routeColour });
    } else {
      dispatch({ type: "SET_ROUTE_COLOUR", payload: gradeColour || "black" });
    }
  }, [state.grade, state.routeColour]);

  const handleTakePhoto = async () => {
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
            <Image
              source={state.routeImg || PlaceholderImage}
              testID="route-image"
              className="w-[250px] h-[400px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
            />
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
              source={state.routeImg || PlaceholderImage}
              className="w-[250px] h-[400px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
            />
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
