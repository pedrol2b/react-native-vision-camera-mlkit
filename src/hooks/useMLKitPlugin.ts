import { useMemo } from 'react';
import { PluginFactory } from '../core/PluginFactory';
import type { MLKitBaseOptions, MLKitFeature } from '../core/types';

/**
 * Generic hook to create any MLKit frame processor plugin.
 *
 * Returns the native `HybridObject` directly (memoized) rather than a
 * JS-level wrapper, so callers can invoke its `recognize` method from a
 * single Worklet closure. Wrapping it in an extra `'worklet'` function
 * here would create a worklet-closing-over-a-worklet chain that does not
 * reliably survive being shared into a different Worklet Runtime (e.g.
 * via `useAsyncRunner`'s native-thread-backed runtime).
 * @template T - The concrete HybridObject type for the requested feature.
 * @param {MLKitFeature} feature - The MLKit feature to use.
 * @param {MLKitBaseOptions} options - Options for the plugin.
 * @returns The native MLKit plugin HybridObject.
 */
export const useMLKitPlugin = <T>(
  feature: MLKitFeature,
  options: MLKitBaseOptions = {}
): T => {
  return useMemo(
    () => PluginFactory.initPlugin(feature, options) as T,
    [feature, options]
  );
};
