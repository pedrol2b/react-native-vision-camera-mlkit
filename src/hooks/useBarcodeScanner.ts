import { useMemo } from 'react';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type {
  Barcode,
  BarcodeScannerPlugin,
  BarcodeScannerPluginOptions,
} from '../types';

import { LINKING_ERROR } from '../constants/LINKING_ERROR';

/**
 * Create a new instance of the {@link BarcodeScannerPlugin}.
 *
 * @param options - The plugin options {@link BarcodeScannerPluginOptions}.
 *
 * @returns The plugin instance {@link BarcodeScannerPlugin}.
 *
 * @throws Will throw an error if the plugin cannot be initialized.
 */
const createBarcodeScannerPlugin = (
  options?: BarcodeScannerPluginOptions
): BarcodeScannerPlugin => {
  const plugin = VisionCameraProxy.initFrameProcessorPlugin('barcodeScanner', {
    ...options,
  });

  if (!plugin) throw new Error(LINKING_ERROR);

  return {
    /**
     * Scans barcodes from a given frame.
     *
     * @param frame - The frame to process {@link Frame}.
     * @returns An array of recognized barcode data {@link Barcode}.
     */
    barcodeScanner: (frame: Frame): Barcode[] => {
      'worklet';
      return plugin.call(frame) as unknown as Barcode[];
    },
  };
};

/**
 * Custom hook to use an instance of the {@link BarcodeScannerPlugin}.
 *
 * @param options - The plugin options {@link BarcodeScannerPluginOptions}.
 *
 * @returns {BarcodeScannerPlugin} A memoized plugin instance that will be
 * destroyed once the component using `useBarcodeScanner()` unmounts.
 *
 * @example
 * ```ts
 * const barcodePlugin = useBarcodeScanner({ formats: ['QR_CODE'] });
 * const frameProcessor = useFrameProcessor((frame) => {
 *   'worklet';
 *   const barcodes = barcodePlugin.barcodeScanner(frame);
 *   console.log(barcodes);
 * }, [barcodePlugin]);
 * ```
 */
export const useBarcodeScanner = (
  options?: BarcodeScannerPluginOptions
): BarcodeScannerPlugin => {
  return useMemo(() => createBarcodeScannerPlugin(options), [options]);
};
