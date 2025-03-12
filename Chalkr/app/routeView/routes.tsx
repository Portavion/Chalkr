import { Text, View, TouchableOpacity, FlatList, Modal } from "react-native";
import { useState, useEffect } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import PlaceholderImage from "@/assets/images/route.png";
import RoutePicture from "@/components/logWorkouts/RoutePicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import React from "react";
import { GradeColour } from "@/constants/Colors";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";
import * as Haptics from "expo-haptics";
import useRoutes from "@/hooks/useRoutes";

cssInterop(Image, { className: "style" });

export default function Routes() {
  const [grade, setGrade] = useState(0);
  const [style, setStyle] = useState<string>("other");
  const [routeId, setRouteId] = useState<number | undefined>();
  const [routeImg, setRouteImg] = useState<null | string>(null);
  const [routeThumbnail, setRouteThumbnail] = useState<null | string>(null);
  const [routes, setRoutes] = useState<Route[]>();
  const [showModal, setShowModal] = useState(false);
  const [selectHoldTypes, setSelectedHoldTypes] = useState<HoldType[]>([]);
  const [routeColour, setRouteColour] = useState<RouteColour | "">("");

  const { fetchAllRoutes, logRoute, deleteRoute } = useRoutes();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routes = (await fetchAllRoutes()) as Route[];
        if (!routes) {
          console.log("error loading probles");
          return;
        }
        setRoutes(routes);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadRoutes();
  }, []);

  //TODO: refactor with lists.tsx to avoid duplicate code
  const renderRouteItem = ({ item }: { item: Route }) => (
    <View key={item.id} className="m-2">
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setRouteId(item.id);
          setRouteImg(item.photo_url);
          setRouteThumbnail(item.thumbnail_url);
          setSelectedHoldTypes(item.hold_types);
          setRouteColour(item.color ? item.color : "");
          setGrade(item.grade || 0);
          setStyle(item.style || "other");
          setShowModal(true);
        }}
      >
        {!(item.color === "VB") && (
          <View
            style={{
              borderRadius: 16,
              borderWidth: 5,
              borderColor:
                item.color === ""
                  ? GradeColour[item.grade || 0] || "black"
                  : item.color,
            }}
          >
            <Image
              source={item.thumbnail_url}
              className="w-[115px] h-[205px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
              transition={200}
              priority="high"
            />
          </View>
        )}
        {item.color === "VB" && (
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
              source={item.thumbnail_url}
              className="w-[115px] h-[205px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
              transition={200}
              priority="high"
            />
          </View>
        )}
        <Text
          className="absolute bottom-1 right-3 font-extrabold text-xl"
          style={{ color: GradeColour[item.grade || 0] || "black" }}
        >
          V{item.grade}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex flex-auto pt-2 items-center bg-stone-300">
      <FlatList
        data={routes}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
        }}
        className="flex-1 mx-2"
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={10}
        removeClippedSubviews={true}
      />

      {showModal && (
        <Modal
          testID="dialog"
          animationType="slide"
          transparent={true}
          visible={showModal}
        >
          <BlurView
            intensity={20}
            className="flex-1 justify-center items-center"
          >
            <View className="bg-stone-200 border border-stone-500 p-2 rounded-xl">
              <RoutePicture
                routeImg={routeImg}
                routeThumbnail={routeThumbnail}
                routeId={routeId}
                setRouteId={setRouteId}
                setRouteImg={setRouteImg}
                setRoutes={setRoutes}
                setRouteThumbnail={setRouteThumbnail}
                setGrade={setGrade}
                setStyle={setStyle}
                setSelectedHoldTypes={setSelectedHoldTypes}
                grade={grade}
                routeColour={routeColour}
                setRouteColour={setRouteColour}
                canCreate={false}
              />

              <View className="flex flex-row gap-4 justify-center items-center">
                <GradeSelector grade={grade} setGrade={setGrade} />
                <ColourSelector
                  routeColour={routeColour}
                  setRouteColour={setRouteColour}
                />
              </View>

              <ClimbingStyleSelector
                selectedStyle={style}
                setSelectedStyle={setStyle}
              />

              <HoldTypeSelector
                selectedHoldTypes={selectHoldTypes}
                setSelectedHoldTypes={setSelectedHoldTypes}
              />

              <View className="flex flex-col items-center ">
                <View className="flex flex-row gap-4 pb-4">
                  <TouchableOpacity
                    onPress={async () => {
                      setShowModal(false);
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      );
                      await logRoute(
                        routeId,
                        grade,
                        style,
                        "",
                        "",
                        "",
                        selectHoldTypes,
                        routeImg,
                        routeThumbnail,
                        routeColour,
                      );
                      setRoutes((prevRoutesState) =>
                        prevRoutesState?.map((route) =>
                          route.id === routeId
                            ? {
                                ...route,
                                grade: grade,
                                style: style,
                                photo_url: routeImg,
                                thumbnail_url: routeThumbnail,
                                color: routeColour,
                              }
                            : route,
                        ),
                      );
                    }}
                    className="mt-2 justify-around rounded-md border bg-slate-50 w-16  py-2 text-lg shadow-sm "
                  >
                    <Text className="text-center">Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      );
                      setShowModal(false);
                      if (routeId) {
                        deleteRoute(routeId);
                        setRoutes((prevRoutesState) =>
                          prevRoutesState?.filter(
                            (route) => route.id !== routeId,
                          ),
                        );
                      }
                    }}
                    className="mt-2 justify-around rounded-md border bg-slate-50 w-16  py-2 text-lg shadow-sm "
                  >
                    <Text className="text-center">Delete</Text>
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
