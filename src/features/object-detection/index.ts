import { useMemo } from 'react';
import type { Frame } from 'react-native-vision-camera';
import { MLKIT_FEATURE_KEYS } from '../../core/constants';
import { normalizeImageUri } from '../../core/normalizeImageUri';
import { PluginFactory } from '../../core/PluginFactory';
import { useMLKitPlugin } from '../../hooks/useMLKitPlugin';
import type { ObjectDetector } from '../../specs/ObjectDetector.nitro';
import type {
  ObjectDetectionArguments,
  ObjectDetectionImageOptions,
  ObjectDetectionOptions,
  ObjectDetectionResult,
} from './types';

/**
 * Detect objects in a static image file.
 * @param {string} uri - The file path or URI of the image.
 * @param {ObjectDetectionImageOptions} options - Options for object detection.
 * @returns {Promise<ObjectDetectionResult>} Promise resolving to the detection result.
 */
export const processImageObjectDetection = async (
  uri: string,
  options: ObjectDetectionImageOptions = {}
): Promise<ObjectDetectionResult> => {
  const detector = PluginFactory.initPlugin(
    MLKIT_FEATURE_KEYS.OBJECT_DETECTION,
    { detectorMode: 'singleImage', ...options }
  ) as ObjectDetector;

  try {
    return await detector.detectImage(normalizeImageUri(uri));
  } finally {
    detector.dispose();
  }
};

/**
 * Hook for object detection from camera frames.
 * @param {ObjectDetectionOptions} options - Options for object detection.
 * @returns Plugin object with objectDetection method.
 */
export const useObjectDetection = (options: ObjectDetectionOptions = {}) => {
  const plugin = useMLKitPlugin<ObjectDetector>(
    MLKIT_FEATURE_KEYS.OBJECT_DETECTION,
    options
  );

  return useMemo(
    () => ({
      objectDetection: (
        frame: Frame,
        args?: ObjectDetectionArguments
      ): ObjectDetectionResult => {
        'worklet';
        return plugin.detect(frame, args ?? {});
      },
    }),
    [plugin]
  );
};

export type {
  DetectedObject,
  ObjectDetectionArguments,
  ObjectDetectionImageOptions,
  ObjectDetectionOptions,
  ObjectDetectionResult,
  ObjectDetectorMode,
  ObjectLabel,
} from './types';
