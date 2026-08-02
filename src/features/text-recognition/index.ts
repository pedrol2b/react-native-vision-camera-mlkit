import { useMemo } from 'react';
import type { Frame } from 'react-native-vision-camera';
import { MLKIT_FEATURE_KEYS } from '../../core/constants';
import { normalizeImageUri } from '../../core/normalizeImageUri';
import { PluginFactory } from '../../core/PluginFactory';
import { useMLKitPlugin } from '../../hooks/useMLKitPlugin';
import type { TextRecognizer } from '../../specs/TextRecognizer.nitro';
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
  const recognizer = PluginFactory.initPlugin(
    MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
    options
  ) as TextRecognizer;

  try {
    return await recognizer.recognizeImage(normalizeImageUri(uri));
  } finally {
    recognizer.dispose();
  }
};

/**
 * Hook for text recognition from camera frames.
 * @param {TextRecognitionOptions} options - Options for text recognition.
 * @returns Plugin object with textRecognition method.
 */
export const useTextRecognition = (options: TextRecognitionOptions = {}) => {
  const plugin = useMLKitPlugin<TextRecognizer>(
    MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
    options
  );

  return useMemo(
    () => ({
      textRecognition: (
        frame: Frame,
        args?: TextRecognitionArguments
      ): TextRecognitionResult => {
        'worklet';
        return plugin.recognize(frame, args ?? {});
      },
    }),
    [plugin]
  );
};

export type {
  TextRecognitionArguments,
  TextRecognitionImageOptions,
  TextRecognitionLanguage,
  TextRecognitionOptions,
  TextRecognitionResult,
} from './types';
