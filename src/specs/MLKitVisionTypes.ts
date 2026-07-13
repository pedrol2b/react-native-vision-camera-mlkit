import type { BarcodeFormat } from '../features/barcode-scanning/types';
import type { TextRecognitionLanguage } from '../features/text-recognition/types';
import type { RegionOfInterest } from '../core/types';

/**
 * ML Kit features that can be compiled into this package.
 */
export type MLKitFeature =
  | 'TextRecognition'
  | 'FaceDetection'
  | 'FaceMeshDetection'
  | 'PoseDetection'
  | 'SelfieSegmentation'
  | 'SubjectSegmentation'
  | 'DocumentScanner'
  | 'BarcodeScanning'
  | 'ImageLabeling'
  | 'ObjectDetection'
  | 'DigitalInkRecognition';

/**
 * Shared options for live frame recognizers.
 */
export interface MLKitRecognizerOptions {
  /**
   * Optional image downscaling for performance optimization.
   */
  scaleFactor?: number;

  /**
   * Invert colors before processing.
   */
  invertColors?: boolean;

  /**
   * Legacy frame skipping option kept for compatibility while v5 examples use frame output throttling.
   */
  frameProcessInterval?: number;

  /**
   * Crop processing to a rectangular region of the frame before running
   * ML Kit, to reduce CPU/GPU work. Result coordinates are mapped back to
   * full source frame coordinates.
   */
  roi?: RegionOfInterest;
}

/**
 * Options for creating a configured text recognizer.
 */
export interface TextRecognizerOptions extends MLKitRecognizerOptions {
  /**
   * Language model used by ML Kit text recognition.
   */
  language?: TextRecognitionLanguage;
}

/**
 * Options for creating a configured barcode scanner.
 */
export interface BarcodeScannerOptions extends MLKitRecognizerOptions {
  /**
   * Restricts detected barcode formats.
   */
  formats?: BarcodeFormat[];

  /**
   * Android-only option for returning potential barcodes.
   */
  enableAllPotentialBarcodes?: boolean;
}
