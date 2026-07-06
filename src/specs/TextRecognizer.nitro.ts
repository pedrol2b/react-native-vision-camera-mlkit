import type { HybridObject } from 'react-native-nitro-modules';
import type { Frame } from 'react-native-vision-camera/lib/specs/instances/Frame.nitro';
import type {
  TextRecognitionArguments,
  TextRecognitionResult,
} from '../features/text-recognition/types';

/**
 * Recognizes text from live VisionCamera frames.
 *
 * @see {@linkcode VisionCameraMLKit.createTextRecognizer}
 */
export interface TextRecognizer
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Runs ML Kit text recognition on a single camera frame.
   */
  recognize(
    frame: Frame,
    args?: TextRecognitionArguments
  ): TextRecognitionResult;
}
