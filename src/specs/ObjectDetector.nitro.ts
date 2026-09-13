import type { HybridObject } from 'react-native-nitro-modules';
import type { Frame } from 'react-native-vision-camera/lib/specs/instances/Frame.nitro';
import type {
  ObjectDetectionArguments,
  ObjectDetectionResult,
} from '../features/object-detection/types';

/**
 * Detects and tracks objects in live VisionCamera frames.
 *
 * @see {@linkcode VisionCameraMLKit.createObjectDetector}
 */
export interface ObjectDetector
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Runs ML Kit object detection on a single camera frame.
   */
  detect(frame: Frame, args?: ObjectDetectionArguments): ObjectDetectionResult;

  /**
   * Runs ML Kit object detection on a static image URI.
   */
  detectImage(uri: string): Promise<ObjectDetectionResult>;
}
