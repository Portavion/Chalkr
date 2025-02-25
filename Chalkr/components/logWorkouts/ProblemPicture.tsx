import { Text, View, TouchableOpacity } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/boulder.png";
import { useEffect, useState } from "react";
import BoulderSelectionModal from "./BoulderSelectionModal";
import { GradeColour } from "@/constants/Colors";

import usePhoto from "@/hooks/usePhoto";

export default function ProblemPicture({
  boulderId,
  setBoulderId,
  boulderImg,
  setBoulderImg,
  boulderThumbnail,
  setBoulderThumbnail,
  setProblems,
  setStyle,
  setGrade,
  grade,
  canCreate = true,
}: {
  boulderId: number | undefined;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  boulderImg: string | null;
  setProblems: React.Dispatch<React.SetStateAction<Problem[] | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
  boulderThumbnail: string | null;
  setBoulderThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  grade: number;
  canCreate?: boolean;
}) {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [gradeColour, setGradeColour] = useState("red");

  const { pickPhotoAsync } = usePhoto();

  useEffect(() => {
    setGradeColour(GradeColour[grade] || "black");
  }, [grade]);

  const handleTakePhoto = async () => {
    const images = await pickPhotoAsync();

    if (!images?.imageFullPath || !images?.thumbnailFullPath) {
      alert("Error loading photo");
      return;
    }
    setBoulderImg(images.imageFullPath);
    setBoulderThumbnail(images.thumbnailFullPath);

    setProblems((prevProblemsState) =>
      prevProblemsState?.map(
        (problem) =>
          problem.id === boulderId // Check if this is the problem to update
            ? {
                ...problem, // Keep existing properties
                // grade: grade, // Update the grade
                // style: style,
                boulderImg: boulderImg,
                thumbnail_url: boulderThumbnail,
              }
            : problem, // Otherwise, keep the problem unchanged
      ),
    );
  };

  return (
    <>
      <View className="flex items-center">
        <Image
          source={boulderImg || PlaceholderImage}
          style={{ borderRadius: 16, borderWidth: 5, borderColor: gradeColour }}
          className="w-[250px] h-[400px] rounded-xl"
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={PlaceholderImage}
        />
        <View className="flex flex-row items-center gap-5">
          {canCreate && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setShowSelectionModal(true);
                }}
                className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
              >
                <Text className="">Select problem</Text>
              </TouchableOpacity>

              <TouchableOpacity
                //TODO: update onPressFunctionn
                onPress={() => {
                  setBoulderId(0);
                  handleTakePhoto();
                }}
                className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
              >
                <Text className="">New problem</Text>
              </TouchableOpacity>
            </>
          )}
          {!canCreate && (
            <TouchableOpacity
              //TODO: update onPressFunctionn
              onPress={handleTakePhoto}
              className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
            >
              <Text className="">New photo</Text>
            </TouchableOpacity>
          )}
        </View>
        {showSelectionModal && (
          <BoulderSelectionModal
            showSelectionModal={true}
            setShowSelectionModal={setShowSelectionModal}
            setBoulderId={setBoulderId}
            setBoulderImg={setBoulderImg}
            setBoulderThumbnail={setBoulderThumbnail}
            setGrade={setGrade}
            setStyle={setStyle}
          />
        )}
      </View>
    </>
  );
}
