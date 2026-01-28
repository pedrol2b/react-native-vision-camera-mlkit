import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

export class ImagePicker {
  static readonly BASE_OPTIONS: ImageLibraryOptions & CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: false,
    selectionLimit: 1,
  };

  static takePhoto = async () => {
    const result = await launchCamera(this.BASE_OPTIONS);

    if (result.didCancel) return null;
    if (result.errorCode) throw new Error(result.errorMessage);

    return result.assets?.[0]?.uri ?? null;
  };

  static pickImage = async () => {
    const result = await launchImageLibrary(this.BASE_OPTIONS);

    if (result.didCancel) return null;
    if (result.errorCode) throw new Error(result.errorMessage);

    return result.assets?.[0]?.uri ?? null;
  };
}
