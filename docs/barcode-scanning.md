# Barcode Scanning API

This page documents the Barcode Scanning API in more detail than the README quick-start.

## Imports

```ts
import {
  useBarcodeScanning,
  processImageBarcodeScanning,
  type BarcodeScanningOptions,
  type BarcodeScanningArguments,
  type BarcodeScanningImageOptions,
  type BarcodeScanningResult,
} from 'react-native-vision-camera-mlkit';
```

## Frame Output

Use `useBarcodeScanning()` for live camera frames, inside a `useFrameOutput`
`onFrame` worklet.

```ts
const { barcodeScanning } = useBarcodeScanning({
  formats: ['QR_CODE', 'CODE_128'],
  enableAllPotentialBarcodes: true,
  scaleFactor: 1,
  invertColors: false,
});

const frameOutput = useFrameOutput({
  onFrame(frame) {
    'worklet';

    try {
      const result = barcodeScanning(frame, {
        outputOrientation: 'portrait',
      });
      console.log(result.barcodes);
    } finally {
      frame.dispose();
    }
  },
});
```

### Frame options

- `formats?: BarcodeFormat[]`
- `enableAllPotentialBarcodes?: boolean` (Android only)
- `scaleFactor?: number` (`0.9`-`1.0`)
- `invertColors?: boolean`
- `roi?: RegionOfInterest` (crop processing to a rectangle of the frame; see the [Region of Interest](../README.md#region-of-interest) section in the main README)
- `frameProcessInterval?: number` (deprecated; throttle frames manually inside `onFrame` instead)

### Frame arguments

- `outputOrientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (iOS only)

## Static Image Processing

Use `processImageBarcodeScanning(uri, options)` for gallery files / local images.

```ts
const result = await processImageBarcodeScanning(imageUri, {
  formats: ['QR_CODE', 'PDF417'],
  enableAllPotentialBarcodes: true,
  orientation: 'portrait',
  invertColors: false,
  scaleFactor: 1,
});
```

### Image options

- `formats?: BarcodeFormat[]`
- `enableAllPotentialBarcodes?: boolean` (Android only)
- `orientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'`
- `invertColors?: boolean`
- `scaleFactor?: number` (`0.9`-`1.0`)
- `roi?: RegionOfInterest` (crop processing to a rectangle of the image; see the [Region of Interest](../README.md#region-of-interest) section in the main README)

## Supported formats

- `ALL_FORMATS`
- `QR_CODE`
- `AZTEC`
- `PDF417`
- `DATA_MATRIX`
- `CODE_128`
- `CODE_39`
- `CODE_93`
- `CODABAR`
- `EAN_13`
- `EAN_8`
- `ITF`
- `UPC_A`
- `UPC_E`
- `UNKNOWN`

## Result shape

`BarcodeScanningResult` contains `barcodes[]`.

Each barcode includes:

- geometry: `bounds`, `corners` (optional — may be absent for potential barcodes)
- identity: `format`, `formatName`, `valueType`, `valueTypeName` — `format`/`valueType` are the raw ML Kit numeric codes; the `*Name` variants are the human-readable string equivalents and are what you should match against in application code
- raw payload: `rawValue`, `displayValue`, `rawBytes`
- `isPotential` (true for potential/undecoded barcode candidates; when `true`, `rawValue`/`rawBytes` may be `null`)
- parsed payload: `value?: BarcodeParsedValue`

### Parsed value typing

`BarcodeParsedValue` is a discriminated union with `type` as `TYPE_*` values.

Examples:

- `TYPE_WIFI`
- `TYPE_URL`
- `TYPE_CONTACT_INFO`
- `TYPE_CALENDAR_EVENT`
- `TYPE_DRIVER_LICENSE`
- `TYPE_TEXT`
- `TYPE_PRODUCT`
- `TYPE_ISBN`

Use `switch (barcode.value?.type)` for strong type inference in TypeScript.

## Errors

For static image processing, promise rejections can use:

- `IMAGE_NOT_FOUND_ERROR`
- `INVALID_URI_ERROR`
- `IMAGE_PROCESSING_FAILED_ERROR`
- `UNSUPPORTED_IMAGE_FORMAT_ERROR`

## Performance guidance

- Filter `formats` whenever possible for better performance.
- Always call `frame.dispose()` exactly once per frame inside `onFrame`.
- Throttle by skipping frames manually inside `onFrame` instead of relying on
  a native-side interval.
- Keep `scaleFactor` as high as possible for decoding reliability.
