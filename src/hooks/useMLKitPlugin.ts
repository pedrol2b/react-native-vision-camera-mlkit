import { useMemo } from 'react';
import type { Frame } from 'react-native-vision-camera';
import { PluginFactory } from '../core/PluginFactory';
import type {
  MLKitBaseArguments,
  MLKitBaseOptions,
  MLKitFeature,
} from '../core/types';

export interface MLKitPlugin {
  recognize: (frame: Frame, args?: MLKitBaseArguments) => any;
}

/**
 * Generic hook to create and use any MLKit frame processor plugin.
 * @param {MLKitFeature} feature - The MLKit feature to use.
 * @param {MLKitBaseOptions} options - Options for the plugin.
 * @returns {MLKitPlugin} An object with a recognize method for processing frames.
 */
export const useMLKitPlugin = (
  feature: MLKitFeature,
  options: MLKitBaseOptions = {}
): MLKitPlugin => {
  return useMemo(() => {
    const plugin = PluginFactory.initPlugin(feature, options);

    return {
      recognize: (frame: Frame, args?: MLKitBaseArguments): any => {
        'worklet';
        return plugin.call(frame, args ?? {});
      },
    };
  }, [feature, options]);
};
