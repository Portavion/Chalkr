import { Text, View, TouchableOpacity } from "react-native";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
import PlaceholderImage from "@/assets/images/boulder.png";

export default function ProblemPicture({
  boulderPhotoUri,
  pickPhotoAsync,
}: {
  boulderPhotoUri: string | undefined;
  pickPhotoAsync: () => void;
}) {
  return (
    <>
      <View className="flex items-center">
        <Image
          source={boulderPhotoUri || PlaceholderImage}
          className="w-[320px] h-[320px]"
        />
        <View className="flex flex-row items-center gap-10">
          <TouchableOpacity
            onPress={() => alert("todo: add selection modal")}
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
        </View>
      </View>
    </>
  );
}
