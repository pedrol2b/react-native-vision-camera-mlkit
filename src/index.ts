import { PluginFactory } from './core/PluginFactory';

export { VisionCameraMLKit } from './core/VisionCameraMLKit';

export const getFeatureErrorMessage = PluginFactory.getFeatureErrorMessage;
export const isFeatureAvailable = PluginFactory.isFeatureAvailable;
export const assertFeatureAvailable = PluginFactory.assertFeatureAvailable;
export const getAvailableFeatures = PluginFactory.getAvailableFeatures;

export {
  IMAGE_NOT_FOUND_ERROR,
  IMAGE_PROCESSING_FAILED_ERROR,
  INVALID_URI_ERROR,
  UNSUPPORTED_IMAGE_FORMAT_ERROR,
} from './shared/constants';

export { MLKIT_FEATURE_KEYS } from './core/constants';

export {
  type BoundingBox,
  type Corner,
  type ImageProcessingBaseOptions,
  type ImageProcessingError,
  type MLKitBaseArguments,
  type MLKitBaseOptions,
  type MLKitFeature,
  type Orientation,
  type RegionOfInterest,
  type RegionOfInterestUnit,
} from './core/types';

export type { BarcodeScanner } from './specs/BarcodeScanner.nitro';
export type {
  BarcodeScannerBarcode,
  BarcodeScannerResult,
} from './specs/BarcodeScannerTypes';
export type {
  BarcodeScannerOptions,
  MLKitRecognizerOptions,
  TextRecognizerOptions,
} from './specs/MLKitVisionTypes';
export type { TextRecognizer } from './specs/TextRecognizer.nitro';
export type { VisionCameraMLKit as VisionCameraMLKitSpec } from './specs/VisionCameraMLKit.nitro';

export * from './features/barcode-scanning';
export * from './features/text-recognition';
