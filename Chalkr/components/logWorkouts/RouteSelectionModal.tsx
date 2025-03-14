import { Modal, Text, View, TouchableOpacity, FlatList } from "react-native";
import { BlurView } from "expo-blur";
import { useContext, useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

import PlaceholderImage from "@/assets/images/route.png";
import { GradeColour } from "@/constants/Colors";
import useRoutes from "@/hooks/useRoutes";
import { WorkoutContext } from "@/app/(tabs)/workout";

export default function RouteSelectionModal({
  showSelectionModal,
  setShowSelectionModal,
}: {
  showSelectionModal: Readonly<boolean>;
  setShowSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RouteSelection modal must be used within a WorkoutContext Provider",
    );
  }

  const { dispatch } = context;

  const [routes, setRoutes] = useState<Route[]>();
  const { fetchAllRoutes } = useRoutes();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routes = (await fetchAllRoutes()) as Route[];
        setRoutes(routes ?? []);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadRoutes();
  }, []);

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
          dispatch({ type: "SET_GRADE", payload: item.grade ?? 0 });
          dispatch({
            type: "SET_SELECTED_STYLE",
            payload: item.style ?? "other",
          });
          dispatch({
            type: "SET_SELECTED_HOLD_TYPES",
            payload: item.hold_types,
          });
          dispatch({
            type: "SET_ROUTE_COLOUR",
            payload: item.color ? item.color : "",
          });
          setShowSelectionModal(false);
        }}
      >
        {!(item.color === "VB") && (
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
              source={item.thumbnail_url ?? PlaceholderImage}
              className="w-[125px] h-[222px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
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
              source={item.thumbnail_url ?? PlaceholderImage}
              className="w-[125px] h-[222px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSelectionModal}
      onRequestClose={() => setShowSelectionModal(false)}
    >
      <BlurView intensity={20} className="flex-1 justify-center items-center">
        <View className="bg-stone-300 border border-stone-600 rounded-xl w-10/12 max-h-[80%]">
          <View className="flex justify-center content-center items-center my-2">
            <Text className="text-lg">Select an existing route</Text>
          </View>
          <FlatList
            data={routes}
            renderItem={renderRouteItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 20,
            }}
            style={{ width: "100%" }}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={10}
            removeClippedSubviews={true}
          />
          <View className="flex flex-row justify-center">
            <TouchableOpacity
              testID="cancel-button"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSelectionModal(false);
              }}
              className="my-2 w-1/4 justify-around rounded-md border bg-slate-50 px-1 py-1 text-lg shadow-sm"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
