import { Modal, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import RoutePicture from "./RoutePicture";
import ClimbingStyleSelector from "./ClimbingStyleSelector";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import * as Haptics from "expo-haptics";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";

export default function LoggingModal({
  handleAscentLog,
  showModal,
  routeImg,
  routeThumbnail,
  grade,
  routeId,
  setGrade,
  selectedStyle,
  setSelectedStyle,
  setRouteId,
  setRouteImg,
  setRoutes,
  setRouteThumbnail,
  selectedHoldTypes,
  setSelectedHoldTypes,
  setRouteColour,
  routeColour,
}: {
  handleAscentLog: (isSuccess: boolean) => void;
  showModal: boolean;
  routeId: number | undefined;
  routeImg: string | null;
  routeThumbnail: string | null;
  grade: number;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  selectedStyle: string;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;
  setRouteId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setRouteImg: React.Dispatch<React.SetStateAction<string | null>>;
  setRouteThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
  setRouteColour: React.Dispatch<React.SetStateAction<RouteColour | "">>;
  routeColour: RouteColour | "";
  setRoutes: React.Dispatch<React.SetStateAction<Route[] | undefined>>;
  selectedHoldTypes: HoldType[];
  setSelectedHoldTypes: React.Dispatch<React.SetStateAction<HoldType[]>>;
}) {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <BlurView intensity={20} className="flex-1 justify-center items-center">
          <View className="bg-stone-200 border border-stone-500 pt-2 rounded-xl">
            <RoutePicture
              routeId={routeId}
              setRouteId={setRouteId}
              setRouteImg={setRouteImg}
              setGrade={setGrade}
              setStyle={setSelectedStyle}
              grade={grade}
              routeImg={routeImg}
              routeThumbnail={routeThumbnail}
              setRouteThumbnail={setRouteThumbnail}
              setRoutes={setRoutes}
              routeColour={routeColour}
              setSelectedHoldTypes={setSelectedHoldTypes}
              setRouteColour={setRouteColour}
            />

            <View className="flex flex-row gap-4 justify-center items-center">
              <GradeSelector grade={grade} setGrade={setGrade} />
              <ColourSelector
                routeColour={routeColour}
                setRouteColour={setRouteColour}
              />
            </View>

            <ClimbingStyleSelector
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
            />

            <HoldTypeSelector
              selectedHoldTypes={selectedHoldTypes}
              setSelectedHoldTypes={setSelectedHoldTypes}
            />

            <View className="flex justify-center content-center items-center mb-5 mx-5 ">
              <Text className="mb-2 text-lg">Was your attempt successful?</Text>
              <View className="flex flex-row justify-around gap-10 items-center ">
                <TouchableOpacity
                  testID="successful-button"
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    handleAscentLog(true);
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color={"green"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="unsuccessful-button"
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    handleAscentLog(false);
                  }}
                >
                  <Ionicons name="remove-circle" size={32} color={"#DC2626"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}
