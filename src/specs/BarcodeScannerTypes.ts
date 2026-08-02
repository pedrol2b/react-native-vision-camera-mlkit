import type { BoundingBox, Corner } from '../core/types';
import type { AnyMap } from 'react-native-nitro-modules';
import type {
  BarcodeFormat,
  BarcodeValueTypeName,
} from '../features/barcode-scanning/types';

/**
 * Codegen-safe barcode data returned by the live Nitro scanner.
 */
export interface BarcodeScannerBarcode {
  /**
   * Barcode bounds in frame coordinates when available.
   */
  bounds?: BoundingBox;

  /**
   * Barcode corner points in frame coordinates when available.
   */
  corners?: Corner[];

  /**
   * Native ML Kit barcode format integer.
   */
  format: number;

  /**
   * Named ML Kit barcode format.
   */
  formatName: BarcodeFormat;

  /**
   * Native ML Kit value type integer.
   */
  valueType: number;

  /**
   * Named ML Kit value type.
   */
  valueTypeName: BarcodeValueTypeName;

  /**
   * Raw barcode payload when ML Kit decoded it.
   */
  rawValue?: string;

  /**
   * Display-ready barcode payload when ML Kit provides one.
   */
  displayValue?: string;

  /**
   * Raw byte payload when available.
   */
  rawBytes?: number[];

  /**
   * Parsed ML Kit barcode payload. This stays untyped at the Nitro boundary
   * because its public representation is a discriminated union.
   */
  value?: AnyMap;

  /**
   * Whether this is an undecoded potential barcode.
   */
  isPotential: boolean;
}

/**
 * Codegen-safe live barcode scanning result.
 */
export interface BarcodeScannerResult {
  /**
   * Barcodes detected in the frame.
   */
  barcodes: BarcodeScannerBarcode[];
}
