import { useMemo } from 'react';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type {
  ImageLabelerPlugin,
  ImageLabelerPluginOptions,
  Label,
} from '../types';

import { LINKING_ERROR } from '../constants/LINKING_ERROR';

/**
 * Create a new instance of the {@link ImageLabelerPlugin}.
 *
 * @param options - The plugin options {@link ImageLabelerPluginOptions}.
 *
 * @returns The plugin instance {@link ImageLabelerPlugin}.
 *
 * @throws Will throw an error if the plugin cannot be initialized.
 */
const createImageLabelerPlugin = (
  options?: ImageLabelerPluginOptions
): ImageLabelerPlugin => {
  const plugin = VisionCameraProxy.initFrameProcessorPlugin('imageLabeler', {
    ...options,
  });

  if (!plugin) throw new Error(LINKING_ERROR);

  return {
    /**
     * Labels objects in a given frame.
     *
     * @param frame - The frame processor {@link Frame}.
     * @returns An array containing the labeled {@link Label} data.
     */
    imageLabeler: (frame: Frame): Label[] => {
      'worklet';
      return plugin.call(frame) as unknown as Label[];
    },
  };
};

/**
 * Custom hook to use an instance of the {@link ImageLabelerPlugin}.
 *
 * @param options - The plugin options {@link ImageLabelerPluginOptions}.
 *
 * @returns {ImageLabelerPlugin} A memoized plugin instance that will be
 * destroyed once the component using `useImageLabeler()` unmounts.
 *
 * @example
 * ```ts
 * const labelPlugin = useImageLabeler({ confidenceThreshold: 70 });
 * const frameProcessor = useFrameProcessor((frame) => {
 *   'worklet';
 *   const labels = labelPlugin.imageLabeler(frame);
 *   console.log(labels);
 * }, [labelPlugin]);
 * ```
 */
export const useImageLabeler = (
  options?: ImageLabelerPluginOptions
): ImageLabelerPlugin => {
  return useMemo(() => createImageLabelerPlugin(options), [options]);
};
