import type { HybridObject } from 'react-native-nitro-modules';
import type { BarcodeScanner } from './BarcodeScanner.nitro';
import type {
  BarcodeScannerOptions,
  MLKitFeature,
  TextRecognizerOptions,
} from './MLKitVisionTypes';
import type { TextRecognizer } from './TextRecognizer.nitro';

/**
 * Root factory for ML Kit recognizers backed by VisionCamera v5 Nitro frames.
 */
export interface VisionCameraMLKit
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Returns whether a feature was compiled into the native package.
   */
  isFeatureAvailable(feature: MLKitFeature): boolean;

  /**
   * Creates a configured text recognizer.
   */
  createTextRecognizer(options: TextRecognizerOptions): TextRecognizer;

  /**
   * Creates a configured barcode scanner.
   */
  createBarcodeScanner(options: BarcodeScannerOptions): BarcodeScanner;
}
