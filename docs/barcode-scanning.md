# Barcode Scanning API

This page documents the Barcode Scanning API in more detail than the README quick-start.

Barcode scanning is implemented by configured Nitro recognizers for both live
frames and static images.

## Imports

```ts
import { useFrameOutput } from 'react-native-vision-camera';
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
- `frameProcessInterval?: number` (deprecated compatibility field; v2 does not use it to throttle processing)

### Frame arguments

- `outputOrientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (iOS only)

## Static Image Processing

Use `processImageBarcodeScanning(uri, options)` for local images. Each call
creates a Nitro scanner with `options` and runs recognition asynchronously.

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
- `orientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (overrides EXIF orientation; omit it to use image metadata)
- `invertColors?: boolean`
- `scaleFactor?: number` (`0.9`-`1.0`)
- `roi?: RegionOfInterest` (crop processing to a rectangle of the image; see the [Region of Interest](../README.md#region-of-interest) section in the main README)

Static images must be local and readable. iOS accepts an absolute path or a
`file://` URI. Android also accepts `content://` URIs, which are copied to a
temporary cache file. Remote URLs and platform-library schemes such as
`ph://` are not supported. Static processing does not require Worklets or a
camera, but VisionCamera v5 and Nitro Modules remain native package
dependencies.

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

Static Nitro calls reject invalid schemes, missing or unreadable files, and
images the platform decoder cannot read. The package exports these
compatibility error-message constants:

- `IMAGE_NOT_FOUND_ERROR`
- `INVALID_URI_ERROR`
- `IMAGE_PROCESSING_FAILED_ERROR`
- `UNSUPPORTED_IMAGE_FORMAT_ERROR`

These constants are retained for source compatibility and user-facing fallback
messages. Nitro rejection messages are platform-specific and are not guaranteed
to equal these strings; do not branch on `error.message`.

## Performance guidance

- Filter `formats` whenever possible for better performance.
- Always call `frame.dispose()` exactly once for every frame, including frames
  you skip; keep disposal in a `finally` block around the whole callback.
- `frameProcessInterval` has no throttling effect in v2. Decide whether to call
  the scanner inside `onFrame`, while still disposing every frame.
- Keep `scaleFactor` as high as possible for decoding reliability.
