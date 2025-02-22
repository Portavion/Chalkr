import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector/GradeSelector";
import useWorkoutData from "@/hooks/useWorkoutData";
import PlaceholderImage from "@/assets/images/boulder.png";
import * as ImagePicker from "expo-image-picker";
import ProblemPicture from "@/components/logWorkouts/ProblemPicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import React from "react";
import { GradeColour } from "@/constants/Colors";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

export default function problems() {
  const [grade, setGrade] = useState(0);
  const [style, setStyle] = useState<string>("other");
  const [boulderId, setBoulderId] = useState<number | undefined>();
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [boulderImg, setBoulderImg] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>();
  const { fetchProblems } = useWorkoutData();
  const [height, setHeight] = useState<number>(750);

  const pickImageAsync = async () => {
    let result;
    setBoulderId(0);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access the camera is required!");
      return;
    }
    try {
      result = await ImagePicker.launchCameraAsync({});
    } catch (error) {}

    if (!result?.canceled && result) {
      setBoulderImg(result?.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

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
            setGrade(problem.grade || 0);
            setStyle(problem.style || "other");
            setShowSelectionModal(false);
          }}
        >
          <Image
            source={problem.photo_url || PlaceholderImage}
            style={{
              borderRadius: 16,
              borderWidth: 3,
              borderColor: GradeColour[problem.grade || 0] || "black",
            }}
            className="w-[100px] h-[150px] rounded-xl"
            contentFit="cover"
          />
          <Text
            className="absolute bottom-0 right-3 font-extrabold text-xl"
            style={{ color: GradeColour[problem.grade || 0] || "black" }}
          >
            V{problem.grade}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View className="flex flex-auto pt-2 items-center bg-stone-300">
      {/**/}
      {/* <ProblemPicture */}
      {/*   boulderPhotoUri={boulderImg} */}
      {/*   pickPhotoAsync={pickImageAsync} */}
      {/*   setBoulderId={setBoulderId} */}
      {/*   setBoulderImg={setBoulderImg} */}
      {/*   setGrade={setGrade} */}
      {/*   setStyle={setStyle} */}
      {/*   grade={grade} */}
      {/* /> */}
      {/**/}
      {/* <GradeSelector grade={grade} setGrade={setGrade} /> */}
      {/**/}
      {/* <ClimbingStyleSelector */}
      {/*   selectedStyle={style} */}
      {/*   setSelectedStyle={setStyle} */}
      {/* /> */}
      <ScrollView className="flex-1">
        <View className="flex flex-row flex-wrap mb-4 gap-4 mx-4 justify-center ">
          {problems && problemPicture}
        </View>
      </ScrollView>
    </View>
  );
}
