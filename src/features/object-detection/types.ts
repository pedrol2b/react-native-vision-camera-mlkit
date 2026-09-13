import type {
  BoundingBox,
  ImageProcessingBaseOptions,
  MLKitBaseArguments,
  MLKitBaseOptions,
} from '../../core/types';

export type ObjectDetectorMode = 'stream' | 'singleImage';

export type ObjectDetectionOptions = MLKitBaseOptions & {
  /** Tracking strategy for object detection. @default 'stream' */
  detectorMode?: ObjectDetectorMode;
  /** Detect every prominent object instead of only the most prominent one. @default false */
  shouldEnableMultipleObjects?: boolean;
  /** Classify objects into ML Kit's coarse category set. @default false */
  shouldEnableClassification?: boolean;
};

export type ObjectDetectionImageOptions = ImageProcessingBaseOptions & {
  /** Tracking strategy for object detection. @default 'singleImage' */
  detectorMode?: ObjectDetectorMode;
  /** Detect every prominent object instead of only the most prominent one. @default false */
  shouldEnableMultipleObjects?: boolean;
  /** Classify objects into ML Kit's coarse category set. @default false */
  shouldEnableClassification?: boolean;
};

export type ObjectDetectionArguments = MLKitBaseArguments & {};

export type ObjectLabel = {
  text: string;
  index: number;
  confidence: number;
};

export type DetectedObject = {
  bounds: BoundingBox;
  /** Null in `singleImage` mode, and in `stream` mode until tracking settles */
  trackingId: number | null;
  /** Empty unless classification is enabled */
  labels: ObjectLabel[];
};

export type ObjectDetectionResult = {
  objects: DetectedObject[];
};
