import { Modal, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import useWorkoutData from "@/hooks/useWorkoutData";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

import PlaceholderImage from "@/assets/images/boulder.png";

export default function BoulderSelectionModal({
  showSelectionModal,
  setShowSelectionModal,
  setBoulderId,
  setBoulderImg,
}: {
  showSelectionModal: boolean;
  setShowSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>();
  const { fetchProblems } = useWorkoutData();
  const [height, setHeight] = useState<number>(750);

  useEffect(() => {
    const loadProblems = async () => {
      if (isLoading) {
        try {
          const problems = await fetchProblems();
          setProblems(problems);
          if (problems && problems.length) {
            setHeight((Math.floor(problems?.length / 3) + 1) * 200);
          }
          setIsLoading(false);
        } catch (error) {
          console.log("error loading problems: " + error);
          setIsLoading(false);
        }
        return () => {};
      }
    };
    loadProblems();
  }, []);

  const problemPicture = problems?.map((problem) => {
    return (
      <View key={problem.id}>
        <TouchableOpacity
          onPress={() => {
            setBoulderId(problem.id);
            setBoulderImg(problem.photo_url);
            setShowSelectionModal(false);
          }}
        >
          <Image
            source={problem.photo_url || PlaceholderImage}
            style={{ borderRadius: 16, borderWidth: 1 }}
            className="w-[100px] h-[150px] rounded-xl"
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSelectionModal}
        onRequestClose={() => (showSelectionModal = false)}
      >
        <BlurView intensity={20} className="flex-1 justify-center items-center">
          <View
            className={`bg-white border rounded-xl w-11/12 flex flex-col ]`}
            style={{ height: height > 600 ? 560 : height }}
          >
            <View className="flex justify-center content-center items-center my-2 ">
              <Text className="text-lg">Select an existing problem</Text>
            </View>
            <ScrollView className="flex-1">
              <View className="flex flex-row flex-wrap mb-4 gap-4 mx-4 justify-center ">
                {problems && problemPicture}
              </View>
            </ScrollView>
            <View className="flex flex-row justify-center">
              <TouchableOpacity
                onPress={() => setShowSelectionModal(false)}
                className="my-2 w-1/4 justify-around rounded-md border bg-slate-50 px-1 py-1 text-lg shadow-sm "
              >
                <Text className="text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}
