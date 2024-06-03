import { useMemo } from 'react';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type {
  Text,
  TextRecognizerPlugin,
  TextRecognizerPluginOptions,
} from '../types';

import { LINKING_ERROR } from '../constants/LINKING_ERROR';

/**
 * Create a new instance of the {@link TextRecognizerPlugin}.
 *
 * @param options - The plugin options {@link TextRecognizerPluginOptions}.
 *
 * @returns The plugin instance {@link TextRecognizerPlugin}.
 *
 * @throws Will throw an error if the plugin cannot be initialized.
 */
const createTextRecognizerPlugin = (
  options?: TextRecognizerPluginOptions
): TextRecognizerPlugin => {
  const plugin = VisionCameraProxy.initFrameProcessorPlugin('textRecognizer', {
    ...options,
  });

  if (!plugin) throw new Error(LINKING_ERROR);

  return {
    /**
     * Scans texts from a given frame.
     *
     * @param frame - The frame to process {@link Frame}.
     * @returns The recognized text data {@link Text}.
     */
    textRecognizer: (frame: Frame): Text => {
      'worklet';
      return plugin.call(frame) as unknown as Text;
    },
  };
};

/**
 * Custom hook to use an instance of the {@link TextRecognizerPlugin}.
 *
 * @param options - The plugin options {@link TextRecognizerPluginOptions}.
 *
 * @returns {TextRecognizerPlugin} A memoized plugin instance that will be
 * destroyed once the component using `useTextRecognizer()` unmounts.
 *
 * @example
 * ```ts
 * const textPlugin = useTextRecognizer({ language: 'LATIN' });
 * const frameProcessor = useFrameProcessor((frame) => {
 *   'worklet';
 *   const text = textPlugin.textRecognizer(frame);
 *   console.log(text);
 * }, [textPlugin]);
 * ```
 */
export const useTextRecognizer = (
  options?: TextRecognizerPluginOptions
): TextRecognizerPlugin => {
  return useMemo(() => createTextRecognizerPlugin(options), [options]);
};
