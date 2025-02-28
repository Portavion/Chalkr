import { Modal, Text, View, TouchableOpacity, FlatList } from "react-native";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import useWorkoutData from "@/hooks/useWorkoutData";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

import PlaceholderImage from "@/assets/images/boulder.png";
import { GradeColour } from "@/constants/Colors";

export default function BoulderSelectionModal({
  showSelectionModal,
  setShowSelectionModal,
  setBoulderId,
  setBoulderImg,
  setBoulderThumbnail,
  setGrade,
  setStyle,
  setSelectedHoldTypes,
  boulderColour,
  setBoulderColour,
}: {
  showSelectionModal: boolean;
  setShowSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
  boulderColour: BoulderColour | "";
  setBoulderColour: React.Dispatch<React.SetStateAction<BoulderColour | "">>;
  setBoulderThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedHoldTypes: React.Dispatch<React.SetStateAction<HoldType[]>>;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [problems, setProblems] = useState<Problem[]>();
  const { fetchProblems } = useWorkoutData();

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problems = (await fetchProblems()) as Problem[];
        setProblems(problems || []);
      } catch (error) {
        console.log("error loading problems: " + error);
      }
    };

    loadProblems();
  }, []);

  const renderProblemItem = ({ item }: { item: Problem }) => (
    <View key={item.id} className="m-2">
      <TouchableOpacity
        onPress={() => {
          setBoulderId(item.id);
          setBoulderImg(item.photo_url);
          setBoulderThumbnail(item.thumbnail_url);
          setGrade(item.grade || 0);
          setStyle(item.style || "other");
          setShowSelectionModal(false);
          setSelectedHoldTypes(item.hold_types);
          setBoulderColour(item.color ? item.color : "");
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
              source={item.thumbnail_url || PlaceholderImage}
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
              source={item.thumbnail_url || PlaceholderImage}
              className="w-[125px] h-[222px] rounded-xl"
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={PlaceholderImage}
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSelectionModal}
      onRequestClose={() => setShowSelectionModal(false)}
    >
      <BlurView intensity={20} className="flex-1 justify-center items-center">
        <View className="bg-stone-300 border border-stone-600 rounded-xl w-10/12 max-h-[80%]">
          <View className="flex justify-center content-center items-center my-2">
            <Text className="text-lg">Select an existing problem</Text>
          </View>
          <FlatList
            data={problems}
            renderItem={renderProblemItem}
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
              onPress={() => setShowSelectionModal(false)}
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
