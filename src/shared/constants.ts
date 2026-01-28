import { Platform } from 'react-native';
import { MLKIT_FEATURE_KEYS } from '../core/constants';
import type { MLKitFeature } from '../core/types';

export const LINKING_ERROR =
  `The package 'react-native-vision-camera-mlkit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TEXT_RECOGNITION_ERROR =
  'Text Recognition feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const FACE_DETECTION_ERROR =
  'Face Detection feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const FACE_MESH_DETECTION_ERROR =
  'Face Mesh Detection feature is not enabled or not supported on iOS. Please enable it in build.gradle (Android only) and rebuild your app.';

const POSE_DETECTION_ERROR =
  'Pose Detection feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const SELFIE_SEGMENTATION_ERROR =
  'Selfie Segmentation feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const SUBJECT_SEGMENTATION_ERROR =
  'Subject Segmentation feature is not enabled or not supported on iOS. Please enable it in build.gradle (Android only) and rebuild your app.';

const DOCUMENT_SCANNER_ERROR =
  'Document Scanner feature is not enabled or not supported on iOS. Please enable it in build.gradle (Android only) and rebuild your app.';

const BARCODE_SCANNING_ERROR =
  'Barcode Scanning feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const IMAGE_LABELING_ERROR =
  'Image Labeling feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const OBJECT_DETECTION_ERROR =
  'Object Detection feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

const DIGITAL_INK_RECOGNITION_ERROR =
  'Digital Ink Recognition feature is not enabled. Please enable it in your Podfile (iOS) or build.gradle (Android) and rebuild your app.';

export const FEATURE_ERROR_MAP: Record<MLKitFeature, string> = {
  [MLKIT_FEATURE_KEYS.TEXT_RECOGNITION]: TEXT_RECOGNITION_ERROR,
  [MLKIT_FEATURE_KEYS.FACE_DETECTION]: FACE_DETECTION_ERROR,
  [MLKIT_FEATURE_KEYS.FACE_MESH_DETECTION]: FACE_MESH_DETECTION_ERROR,
  [MLKIT_FEATURE_KEYS.POSE_DETECTION]: POSE_DETECTION_ERROR,
  [MLKIT_FEATURE_KEYS.SELFIE_SEGMENTATION]: SELFIE_SEGMENTATION_ERROR,
  [MLKIT_FEATURE_KEYS.SUBJECT_SEGMENTATION]: SUBJECT_SEGMENTATION_ERROR,
  [MLKIT_FEATURE_KEYS.DOCUMENT_SCANNER]: DOCUMENT_SCANNER_ERROR,
  [MLKIT_FEATURE_KEYS.BARCODE_SCANNING]: BARCODE_SCANNING_ERROR,
  [MLKIT_FEATURE_KEYS.IMAGE_LABELING]: IMAGE_LABELING_ERROR,
  [MLKIT_FEATURE_KEYS.OBJECT_DETECTION]: OBJECT_DETECTION_ERROR,
  [MLKIT_FEATURE_KEYS.DIGITAL_INK_RECOGNITION]: DIGITAL_INK_RECOGNITION_ERROR,
};

export const IMAGE_NOT_FOUND_ERROR =
  'Image file not found at the specified path.';

export const INVALID_URI_ERROR = 'Invalid image URI provided.';

export const IMAGE_PROCESSING_FAILED_ERROR =
  'Image processing failed. Check that the image format is supported and the file is not corrupted.';

export const UNSUPPORTED_IMAGE_FORMAT_ERROR =
  'Unsupported image format. Only JPEG, PNG, and WebP are supported.';

export const MISSING_MODULE_ERROR =
  'VisionCameraMLKit native module is not available. Ensure it is linked, pods are installed, and the app was rebuilt.';
