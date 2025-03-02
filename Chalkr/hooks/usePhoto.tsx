import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const usePhoto = () => {
  const copyImageFromCache = async (cacheImageUri: string) => {
    const destinationDir = FileSystem.documentDirectory + "route/";
    const fileName = `route_${Date.now()}.jpg`;
    const destinationUri = destinationDir + fileName;

    await FileSystem.makeDirectoryAsync(destinationDir, {
      intermediates: true,
    });
    await FileSystem.moveAsync({
      from: cacheImageUri,
      to: destinationUri,
    });

    return destinationUri;
  };
  const makeThumbnail = async (fullImageUri: string) => {
    const manipThumbnail = await ImageManipulator.manipulate(fullImageUri)
      .resize({ width: 300 })
      .renderAsync();

    const thumbnailImage = await manipThumbnail.saveAsync({
      format: SaveFormat.WEBP,
    });

    const thumbnailInfo = await FileSystem.getInfoAsync(thumbnailImage.uri);
    const thumbnailImageFilename = thumbnailImage.uri.split("/").pop();
    const thumbnailFullPath =
      FileSystem.documentDirectory +
      "route/" +
      "thumb_" +
      thumbnailImageFilename;
    try {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "route/",
        { intermediates: true },
      );
      await FileSystem.copyAsync({
        from: thumbnailInfo.uri,
        to: thumbnailFullPath,
      });
    } catch (error) {
      console.log(error);
    }

    return thumbnailFullPath;
  };

  const makeFullImage = async (photoUri: string) => {
    const manipResult = await ImageManipulator.manipulate(photoUri)
      .resize({ width: 1080 })
      .renderAsync();

    const fullImage = await manipResult.saveAsync({
      format: SaveFormat.WEBP,
    });

    try {
      await FileSystem.deleteAsync(photoUri);
    } catch (e) {
      console.log(e);
    }

    return fullImage.uri;
  };

  const pickPhotoAsync = async () => {
    let result;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access the camera is required!");
      return;
    }
    try {
      result = await ImagePicker.launchCameraAsync({
        quality: 0.75,
        base64: false,
      });
      if (!result?.assets) {
        alert("No pictures taken");
        return;
      }
      const imageUri = await copyImageFromCache(result.assets[0].uri);
      const imageFullPath = await makeFullImage(imageUri);
      const thumbnailFullPath = await makeThumbnail(imageFullPath);

      return {
        imageFullPath: imageFullPath,
        thumbnailFullPath: thumbnailFullPath,
      };
    } catch (error) {
      console.log(error);
      return { imageFullPath: "", thumbnailFullPath: "" };
    }
  };

  return { pickPhotoAsync, copyImageFromCache, makeThumbnail, makeFullImage };
};
export default usePhoto;
