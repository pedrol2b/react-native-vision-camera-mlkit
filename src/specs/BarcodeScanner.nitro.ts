import type { HybridObject } from 'react-native-nitro-modules';
import type { Frame } from 'react-native-vision-camera/lib/specs/instances/Frame.nitro';
import type { BarcodeScanningArguments } from '../features/barcode-scanning/types';
import type { BarcodeScannerResult } from './BarcodeScannerTypes';

/**
 * Scans barcodes from live VisionCamera frames.
 *
 * @see {@linkcode VisionCameraMLKit.createBarcodeScanner}
 */
export interface BarcodeScanner
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Runs ML Kit barcode scanning on a single camera frame.
   */
  recognize(
    frame: Frame,
    args?: BarcodeScanningArguments
  ): BarcodeScannerResult;
}
