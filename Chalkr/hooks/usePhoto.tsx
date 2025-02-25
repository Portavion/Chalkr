import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const usePhoto = () => {
  const copyImageFromCache = async (cacheImageUri: string) => {
    console.log(FileSystem.getInfoAsync(cacheImageUri));

    const copyUri = FileSystem.documentDirectory + "boulder/";
    await FileSystem.copyAsync({
      from: cacheImageUri,
      to: copyUri,
    });

    return copyUri;
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
      "boulder/" +
      "thumb_" +
      thumbnailImageFilename;
    try {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "boulder/",
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

    const fullImageInfo = await FileSystem.getInfoAsync(fullImage.uri);
    const fullImageFilename = fullImageInfo.uri.split("/").pop();
    const imageFullPath =
      FileSystem.documentDirectory + "boulder/" + fullImageFilename;

    try {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "boulder/",
        { intermediates: true },
      );
      await FileSystem.copyAsync({
        from: fullImageInfo.uri, // Source URI
        to: imageFullPath, // Destination URI
      });
    } catch (error) {
      console.log(error);
    }
    return imageFullPath;
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
        quality: 0.7,
        base64: false,
      });
      if (!result?.assets) {
        alert("No pictures taken");
        return;
      }

      const imageFullPath = await makeThumbnail(result.assets[0].uri);
      const thumbnailFullPath = await makeThumbnail(result.assets[0].uri);

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
