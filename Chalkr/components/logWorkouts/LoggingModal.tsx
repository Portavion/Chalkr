import { Modal, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import ProblemPicture from "./ProblemPicture";
import ClimbingStyleSelector from "./ClimbingStyleSelector";
import GradeSelector from "./GradeSelector/GradeSelector";

export default function LoggingModal({
  handleAscentLog,
  showModal,
  boulderPhotoUri,
  pickPhotoAsync,
  grade,
  setGrade,
  selectedStyle,
  setSelectedStyle,
  setBoulderId,
  setBoulderImg,
}: {
  handleAscentLog: (isSuccess: boolean) => void;
  showModal: boolean;
  boulderPhotoUri: string | null;
  pickPhotoAsync: () => void;
  grade: number;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  selectedStyle: ClimbingStyle;
  setSelectedStyle: React.Dispatch<React.SetStateAction<ClimbingStyle>>;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <BlurView intensity={20} className="flex-1 justify-center items-center">
          <View className="bg-white border rounded-xl">
            <ProblemPicture
              boulderPhotoUri={boulderPhotoUri}
              pickPhotoAsync={pickPhotoAsync}
              setBoulderId={setBoulderId}
              setBoulderImg={setBoulderImg}
            />

            <GradeSelector grade={grade} setGrade={setGrade} />

            <ClimbingStyleSelector
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
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
