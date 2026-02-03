import type { Frame } from 'react-native-vision-camera';
import { NativeBridge } from '../../core/NativeBridge';
import { MLKIT_FEATURE_KEYS } from '../../core/constants';
import { useMLKitPlugin } from '../../hooks/useMLKitPlugin';
import type {
  BarcodeScanningArguments,
  BarcodeScanningImageOptions,
  BarcodeScanningOptions,
  BarcodeScanningResult,
} from './types';

/**
 * Scan barcodes from a static image file.
 * @param {string} uri - The file path or URI of the image.
 * @param {BarcodeScanningImageOptions} options - Options for barcode scanning.
 * @returns {Promise<BarcodeScanningResult>} Promise resolving to the scan result.
 */
export const processImageBarcodeScanning = async (
  uri: string,
  options: BarcodeScanningImageOptions = {}
): Promise<BarcodeScanningResult> => {
  return await NativeBridge.processImage(
    MLKIT_FEATURE_KEYS.BARCODE_SCANNING,
    uri,
    options
  );
};

/**
 * Hook for barcode scanning from camera frames.
 * @param {BarcodeScanningOptions} options - Options for barcode scanning.
 * @returns Plugin object with barcodeScanning method.
 */
export const useBarcodeScanning = (options: BarcodeScanningOptions = {}) => {
  const plugin = useMLKitPlugin(MLKIT_FEATURE_KEYS.BARCODE_SCANNING, options);

  return {
    barcodeScanning: (
      frame: Frame,
      args?: BarcodeScanningArguments
    ): BarcodeScanningResult => {
      'worklet';
      return plugin.recognize(frame, args);
    },
  };
};

export type {
  Barcode,
  BarcodeFormat,
  BarcodeScanningArguments,
  BarcodeScanningImageOptions,
  BarcodeScanningOptions,
  BarcodeScanningResult,
  BarcodeValueType,
} from './types';
