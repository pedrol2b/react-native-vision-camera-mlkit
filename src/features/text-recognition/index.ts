import type { Frame } from 'react-native-vision-camera';
import { NativeBridge } from '../../core/NativeBridge';
import { MLKIT_FEATURE_KEYS } from '../../core/constants';
import { useMLKitPlugin } from '../../hooks/useMLKitPlugin';
import type {
  TextRecognitionArguments,
  TextRecognitionImageOptions,
  TextRecognitionOptions,
  TextRecognitionResult,
} from './types';

/**
 * Recognize text from a static image file.
 * @param {string} uri - The file path or URI of the image.
 * @param {TextRecognitionImageOptions} options - Options for text recognition.
 * @returns {Promise<TextRecognitionResult>} Promise resolving to the recognition result.
 */
export const processImageTextRecognition = async (
  uri: string,
  options: TextRecognitionImageOptions = {}
): Promise<TextRecognitionResult> => {
  return await NativeBridge.processImage(
    MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
    uri,
    options
  );
};

/**
 * Hook for text recognition from camera frames.
 * @param {TextRecognitionOptions} options - Options for text recognition.
 * @returns Plugin object with textRecognition method.
 */
export const useTextRecognition = (options: TextRecognitionOptions = {}) => {
  const plugin = useMLKitPlugin(MLKIT_FEATURE_KEYS.TEXT_RECOGNITION, options);

  return {
    textRecognition: (
      frame: Frame,
      args?: TextRecognitionArguments
    ): TextRecognitionResult => {
      'worklet';
      return plugin.recognize(frame, args);
    },
  };
};

export type {
  TextRecognitionArguments,
  TextRecognitionImageOptions,
  TextRecognitionLanguage,
  TextRecognitionOptions,
  TextRecognitionResult,
} from './types';
