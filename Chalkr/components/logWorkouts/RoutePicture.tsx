import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/route.png";
import { useEffect, useState } from "react";
import RouteSelectionModal from "./RouteSelectionModal";
import { GradeColour, RouteColors } from "@/constants/Colors";

import usePhoto from "@/hooks/usePhoto";

export default function RoutePicture({
  routeId,
  setRouteId,
  routeImg,
  setRouteImg,
  routeThumbnail,
  setRouteThumbnail,
  setRoutes,
  setStyle,
  setGrade,
  grade,
  setSelectedHoldTypes,
  canCreate = true,
  routeColour,
  setRouteColour,
}: {
  routeId: number | undefined;
  setRouteId: React.Dispatch<React.SetStateAction<number | undefined>>;
  routeImg: string | null;
  setRoutes: React.Dispatch<React.SetStateAction<Route[] | undefined>>;
  setRouteImg: React.Dispatch<React.SetStateAction<string | null>>;
  routeThumbnail: string | null;
  setRouteThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  grade: number;
  setSelectedHoldTypes: React.Dispatch<React.SetStateAction<HoldType[]>>;
  routeColour: RouteColour | "";
  setRouteColour: React.Dispatch<React.SetStateAction<RouteColour | "">>;
  canCreate?: boolean;
}) {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [gradeColour, setGradeColour] = useState("red");

  const { pickPhotoAsync } = usePhoto();

  useEffect(() => {
    if (routeColour !== "") {
      setGradeColour(RouteColors[routeColour]);
    } else {
      setGradeColour(GradeColour[grade] || "black");
    }
  }, [grade, routeColour]);

  const handleTakePhoto = async () => {
    const images = await pickPhotoAsync();

    if (!images?.imageFullPath || !images?.thumbnailFullPath) {
      alert("Error loading photo");
      return;
    }
    setRouteImg(images.imageFullPath);
    setRouteThumbnail(images.thumbnailFullPath);

    setRoutes((prevRoutesState) =>
      prevRoutesState?.map(
        (route) =>
          route.id === routeId // Check if this is the route to update
            ? {
                ...route, // Keep existing properties
                // grade: grade, // Update the grade
                // style: style,
                routeImg: routeImg,
                thumbnail_url: routeThumbnail,
              }
            : route, // Otherwise, keep the route unchanged
      ),
    );
  };

  return (
    <>
      <View className="flex items-center">
        {!(routeColour === "VB") && (
          <View
            testID="route-image-container"
            style={{
              borderRadius: 16,
              borderWidth: 5,
              borderColor: gradeColour,
            }}
          >
            <Image
              source={routeImg || PlaceholderImage}
              testID="route-image"
              className="w-[250px] h-[400px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
            />
          </View>
        )}
        {routeColour === "VB" && (
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
              source={routeImg || PlaceholderImage}
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
                //TODO: update onPressFunctionn
                testID="new-route-button"
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  setRouteId(0);
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
              //TODO: update onPressFunctionn
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
            setRouteId={setRouteId}
            setRouteImg={setRouteImg}
            setRouteThumbnail={setRouteThumbnail}
            setSelectedHoldTypes={setSelectedHoldTypes}
            routeColour={routeColour}
            setRouteColour={setRouteColour}
            setGrade={setGrade}
            setStyle={setStyle}
          />
        )}
      </View>
    </>
  );
}
