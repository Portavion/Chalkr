import { Text, View, TouchableOpacity } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/boulder.png";
import { useEffect, useState } from "react";
import BoulderSelectionModal from "./BoulderSelectionModal";
import { GradeColour } from "@/constants/Colors";

export default function ProblemPicture({
  boulderPhotoUri,
  pickPhotoAsync,
  setBoulderId,
  setBoulderImg,
  setStyle,
  setGrade,
  grade,
  canCreate = true,
}: {
  boulderPhotoUri: string | null;
  pickPhotoAsync: () => void;
  setBoulderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBoulderImg: React.Dispatch<React.SetStateAction<string | null>>;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
  grade: number;
  canCreate?: boolean;
}) {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [gradeColour, setGradeColour] = useState("red");

  useEffect(() => {
    setGradeColour(GradeColour[grade] || "black");
  }, [grade]);

  return (
    <>
      <View className="flex items-center">
        <Image
          source={boulderPhotoUri || PlaceholderImage}
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
                onPress={pickPhotoAsync}
                className="mt-2 justify-around rounded-md border bg-slate-50 px-3 py-2 text-lg shadow-sm "
              >
                <Text className="">New problem</Text>
              </TouchableOpacity>
            </>
          )}
          {!canCreate && (
            <TouchableOpacity
              onPress={pickPhotoAsync}
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
            setGrade={setGrade}
            setStyle={setStyle}
          />
        )}
      </View>
    </>
  );
}
