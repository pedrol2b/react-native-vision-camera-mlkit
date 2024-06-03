import { useMemo } from 'react';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type {
  Object,
  ObjectDetectorPlugin,
  ObjectDetectorPluginOptions,
} from '../types';

import { LINKING_ERROR } from '../constants/LINKING_ERROR';

/**
 * Create a new instance of the {@link ObjectDetectorPlugin}.
 *
 * @param options - The plugin options {@link ObjectDetectorPluginOptions}.
 *
 * @returns The plugin instance {@link ObjectDetectorPlugin}.
 *
 * @throws Will throw an error if the plugin cannot be initialized.
 */
const createObjectDetectorPlugin = (
  options?: ObjectDetectorPluginOptions
): ObjectDetectorPlugin => {
  const plugin = VisionCameraProxy.initFrameProcessorPlugin('objectDetector', {
    ...options,
  });

  if (!plugin) throw new Error(LINKING_ERROR);

  return {
    /**
     * Detects objects in a given frame.
     *
     * @param frame - The frame processor {@link Frame}.
     * @returns An array containing the detected {@link Object} data.
     */
    objectDetector: (frame: Frame): Object[] => {
      'worklet';
      return plugin.call(frame) as unknown as Object[];
    },
  };
};

/**
 * Custom hook to use an instance of the {@link ObjectDetectorPlugin}.
 *
 * @param options - The plugin options {@link ObjectDetectorPluginOptions}.
 *
 * @returns {ObjectDetectorPlugin} A memoized plugin instance that will be
 * destroyed once the component using `useObjectDetector()` unmounts.
 *
 * @example
 * ```ts
 * const objectPlugin = useObjectDetector({ enableMultipleObjects: true });
 * const frameProcessor = useFrameProcessor((frame) => {
 *   'worklet';
 *   const objects = objectPlugin.objectDetector(frame);
 *   console.log(objects);
 * }, [objectPlugin]);
 * ```
 */
export const useObjectDetector = (
  options?: ObjectDetectorPluginOptions
): ObjectDetectorPlugin => {
  return useMemo(() => createObjectDetectorPlugin(options), [options]);
};
