import { useMemo } from 'react';
import type { Frame } from 'react-native-vision-camera';
import { MLKIT_FEATURE_KEYS } from '../../core/constants';
import { normalizeImageUri } from '../../core/normalizeImageUri';
import { PluginFactory } from '../../core/PluginFactory';
import { useMLKitPlugin } from '../../hooks/useMLKitPlugin';
import type { BarcodeScanner } from '../../specs/BarcodeScanner.nitro';
import { mapStaticBarcodeResult } from './mapStaticBarcodeResult';
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
  const scanner = PluginFactory.initPlugin(
    MLKIT_FEATURE_KEYS.BARCODE_SCANNING,
    options
  ) as BarcodeScanner;

  try {
    return mapStaticBarcodeResult(
      await scanner.recognizeImage(normalizeImageUri(uri))
    );
  } finally {
    scanner.dispose();
  }
};

/**
 * Hook for barcode scanning from camera frames.
 */
export const useBarcodeScanning = (options: BarcodeScanningOptions = {}) => {
  const plugin = useMLKitPlugin<BarcodeScanner>(
    MLKIT_FEATURE_KEYS.BARCODE_SCANNING,
    options
  );

  return useMemo(
    () => ({
      barcodeScanning: (
        frame: Frame,
        args?: BarcodeScanningArguments
      ): BarcodeScanningResult => {
        'worklet';
        return plugin.recognize(frame, args ?? {}) as BarcodeScanningResult;
      },
    }),
    [plugin]
  );
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
