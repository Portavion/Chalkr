import { Text, View, TouchableOpacity, FlatList, Modal } from "react-native";
import { useState, useEffect } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector/GradeSelector";
import useWorkoutData from "@/hooks/useWorkoutData";
import PlaceholderImage from "@/assets/images/boulder.png";
import ProblemPicture from "@/components/logWorkouts/ProblemPicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import React from "react";
import { GradeColour } from "@/constants/Colors";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";

cssInterop(Image, { className: "style" });

export default function Problems() {
  const [grade, setGrade] = useState(0);
  const [style, setStyle] = useState<string>("other");
  const [boulderId, setBoulderId] = useState<number | undefined>();
  const [boulderImg, setBoulderImg] = useState<null | string>(null);
  const [boulderThumbnail, setBoulderThumbnail] = useState<null | string>(null);
  const [problems, setProblems] = useState<ProblemWithHoldTypes[]>();
  const [showModal, setShowModal] = useState(false);
  const [selectHoldTypes, setSelectedHoldTypes] = useState<HoldType[]>([]);

  const { fetchProblems, logProblem, deleteProblem } = useWorkoutData();

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problems = (await fetchProblems()) as ProblemWithHoldTypes[];
        if (!problems) {
          console.log("error loading probles");
          return;
        }
        setProblems(problems);
      } catch (error) {
        console.log("error loading problems: " + error);
      }
    };

    loadProblems();
  }, []);

  const renderProblemItem = ({ item }: { item: ProblemWithHoldTypes }) => (
    <View key={item.id} className="m-2">
      <TouchableOpacity
        onPress={() => {
          setBoulderId(item.id);
          setBoulderImg(item.photo_url);
          setBoulderThumbnail(item.thumbnail_url);
          setSelectedHoldTypes(item.hold_types);
          setGrade(item.grade || 0);
          setStyle(item.style || "other");
          setShowModal(true);
        }}
      >
        <Image
          source={item.thumbnail_url}
          style={{
            borderRadius: 16,
            borderWidth: 3,
            borderColor: GradeColour[item.grade || 0] || "black",
          }}
          className="w-[125px] h-[225px] rounded-xl"
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={PlaceholderImage}
          transition={200}
          priority="high"
        />
        <Text
          className="absolute bottom-0 right-3 font-extrabold text-xl"
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
        data={problems}
        renderItem={renderProblemItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
        }}
        className="flex-1 w-full"
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
              <ProblemPicture
                boulderImg={boulderImg}
                boulderThumbnail={boulderThumbnail}
                boulderId={boulderId}
                setBoulderId={setBoulderId}
                setBoulderImg={setBoulderImg}
                setProblems={setProblems}
                setBoulderThumbnail={setBoulderThumbnail}
                setGrade={setGrade}
                setStyle={setStyle}
                grade={grade}
                canCreate={false}
              />

              <GradeSelector grade={grade} setGrade={setGrade} />

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
                    onPress={() => {
                      setShowModal(false);
                      logProblem(
                        boulderId,
                        grade,
                        style,
                        "",
                        "",
                        "",
                        selectHoldTypes,
                        boulderImg,
                        boulderThumbnail,
                      );
                      setProblems((prevProblemsState) =>
                        prevProblemsState?.map((problem) =>
                          problem.id === boulderId
                            ? {
                                ...problem,
                                grade: grade,
                                style: style,
                                photo_url: boulderImg,
                                thumbnail_url: boulderThumbnail,
                              }
                            : problem,
                        ),
                      );
                    }}
                    className="mt-2 justify-around rounded-md border bg-slate-50 w-16  py-2 text-lg shadow-sm "
                  >
                    <Text className="text-center">Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      if (boulderId) {
                        deleteProblem(boulderId);
                        setProblems((prevProblemsState) =>
                          prevProblemsState?.filter(
                            (problem) => problem.id !== boulderId,
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
