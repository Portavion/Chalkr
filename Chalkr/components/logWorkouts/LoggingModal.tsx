import { Modal, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import ProblemPicture from "./ProblemPicture";
import ClimbingStyleSelector from "./ClimbingStyleSelector";
import GradeSelector from "./GradeSelector/GradeSelector";
import usePhoto from "@/hooks/usePhoto";
import HoldTypeSelector from "./HoldTypeSelector";
import ColourSelector from "./ColourSelector";

export default function LoggingModal({
  handleAscentLog,
  showModal,
  boulderImg,
  boulderThumbnail,
  grade,
  boulderId,
  setGrade,
  selectedStyle,
  setSelectedStyle,
  setBoulderId,
  setBoulderImg,
  setProblems,
  setBoulderThumbnail,
  selectedHoldTypes,
  setSelectedHoldTypes,
  setBoulderColour,
  boulderColour,
}: {
  handleAscentLog: (isSuccess: boolean) => void;
  showModal: boolean;
  boulderId: number | undefined;
  boulderImg: string | null;
  boulderThumbnail: string | null;
  grade: number;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  selectedStyle: string;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
  setBoulderThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
  setBoulderColour: React.Dispatch<React.SetStateAction<BoulderColour | "">>;
  boulderColour: BoulderColour | "";
  setProblems: React.Dispatch<
    React.SetStateAction<ProblemWithHoldTypes[] | undefined>
  >;
  selectedHoldTypes: HoldType[];
  setSelectedHoldTypes: React.Dispatch<React.SetStateAction<HoldType[]>>;
}) {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <BlurView intensity={20} className="flex-1 justify-center items-center">
          <View className="bg-stone-200 border border-stone-500 pt-2 rounded-xl">
            <ProblemPicture
              boulderId={boulderId}
              setBoulderId={setBoulderId}
              setBoulderImg={setBoulderImg}
              setGrade={setGrade}
              setStyle={setSelectedStyle}
              grade={grade}
              boulderImg={boulderImg}
              boulderThumbnail={boulderThumbnail}
              setBoulderThumbnail={setBoulderThumbnail}
              setProblems={setProblems}
              boulderColour={boulderColour}
              setSelectedHoldTypes={setSelectedHoldTypes}
              setBoulderColour={setBoulderColour}
            />

            <View className="flex flex-row gap-4 justify-center items-center">
              <GradeSelector grade={grade} setGrade={setGrade} />
              <ColourSelector
                boulderColour={boulderColour}
                setBoulderColour={setBoulderColour}
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
                  onPress={() => {
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
                  onPress={() => {
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
