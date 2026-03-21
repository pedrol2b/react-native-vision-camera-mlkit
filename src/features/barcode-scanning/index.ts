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
  BarcodeData,
  BarcodeFormat,
  BarcodeParsedValue,
  BarcodeScanningArguments,
  BarcodeScanningImageOptions,
  BarcodeScanningOptions,
  BarcodeScanningResult,
  BarcodeValueTypeName,
} from './types';
