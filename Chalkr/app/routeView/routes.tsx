import { useContext, useEffect, useState } from "react";
import PlaceholderImage from "@/assets/images/route.png";
import { View, Text, FlatList, Modal, TouchableOpacity } from "react-native";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import { Image } from "expo-image";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import RoutePicture from "@/components/logWorkouts/RoutePicture";
import { GradeColour } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import useRoutes from "@/hooks/useRoutes";
import { WorkoutContext } from "@/context/WorkoutContext";
import RouteAttributeSelectors from "@/components/logWorkouts/RouteAttributeSelectors";

export default function ListsScreen() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RoutePicture must be used within a WorkoutContext Provider",
    );
  }

  const { state, dispatch } = context;
  const [showModal, setShowModal] = useState(false);

  const { fetchAllRoutes, logRoute, deleteRoute } = useRoutes();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routes = (await fetchAllRoutes()) as Route[];
        if (!routes) {
          console.log("error loading probles");
          return;
        }
        dispatch({ type: "SET_ROUTES", payload: routes });
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadRoutes();
  }, []);

  //TODO: refactor with routes.tsx to avoid duplicate code
  const renderRouteItem = ({ item }: { item: Route }) => (
    <View key={item.id} className="m-2">
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          dispatch({ type: "SET_ROUTE_ID", payload: item.id });
          dispatch({ type: "SET_ROUTE_IMG", payload: item.photo_url });
          dispatch({
            type: "SET_ROUTE_THUMBNAIL",
            payload: item.thumbnail_url,
          });
          dispatch({
            type: "SET_SELECTED_HOLD_TYPES",
            payload: item.hold_types,
          });
          dispatch({
            type: "SET_ROUTE_COLOUR",
            payload: item.color ? item.color : "",
          });
          dispatch({ type: "SET_GRADE", payload: item.grade ?? 0 });
          dispatch({
            type: "SET_SELECTED_STYLE",
            payload: item.style ?? "other",
          });
          setShowModal(true);
        }}
      >
        {item.color !== "VB" && (
          <View
            style={{
              borderRadius: 16,
              borderWidth: 5,
              borderColor:
                item.color === ""
                  ? (GradeColour[item.grade ?? 0] ?? "black")
                  : item.color,
            }}
          >
            <Image
              source={item.thumbnail_url ?? item.photo_url ?? PlaceholderImage}
              className="w-[115px] h-[205px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
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
              source={item.thumbnail_url ?? item.photo_url ?? PlaceholderImage}
              className="w-[115px] h-[205px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
              priority="high"
            />
          </View>
        )}
        <Text
          className="absolute bottom-1 right-3 font-extrabold text-xl"
          style={{ color: GradeColour[item.grade ?? 0] ?? "black" }}
        >
          V{item.grade}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex flex-auto pt-2 items-center bg-stone-300">
      <FlatList
        data={state.routes}
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
        <Modal animationType="slide" transparent={true} visible={showModal}>
          <BlurView
            intensity={20}
            className="flex-1 justify-center items-center"
          >
            <View className="bg-stone-200 border border-stone-500 p-2 rounded-xl">
              <RoutePicture canCreate={false} />
              <RouteAttributeSelectors />
              <View className="flex flex-col items-center ">
                <View className="flex flex-row gap-4 pb-4">
                  <TouchableOpacity
                    onPress={async () => {
                      setShowModal(false);
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      );
                      await logRoute(
                        state.routeId,
                        state.grade,
                        state.selectedStyle,
                        "",
                        "",
                        "",
                        state.selectHoldTypes,
                        state.routeImg,
                        state.routeThumbnail,
                        state.routeColour,
                      );
                      const updatedRoutes = state.routes?.map((route) =>
                        route.id === state.routeId
                          ? {
                              ...route,
                              grade: state.grade,
                              style: state.selectedStyle,
                              photo_url: state.routeImg,
                              thumbnail_url: state.routeThumbnail,
                              color: state.routeColour,
                            }
                          : route,
                      );
                      dispatch({
                        type: "SET_ROUTES",
                        payload: updatedRoutes,
                      });
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
                      if (state.routeId) {
                        deleteRoute(state.routeId);
                        const updatedRoutes = state.routes?.filter(
                          (route) => route.id !== state.routeId,
                        );
                        dispatch({
                          type: "SET_ROUTES",
                          payload: updatedRoutes,
                        });
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
