# Text Recognition API

This page documents the Text Recognition API in more detail than the README quick-start.

Text recognition is implemented by configured Nitro recognizers for both live
frames and static images.

## Imports

```ts
import { useFrameOutput } from 'react-native-vision-camera';
import {
  useTextRecognition,
  processImageTextRecognition,
  type TextRecognitionOptions,
  type TextRecognitionArguments,
  type TextRecognitionImageOptions,
  type TextRecognitionResult,
} from 'react-native-vision-camera-mlkit';
```

## Frame Output

Use `useTextRecognition()` for live camera frames, inside a `useFrameOutput`
`onFrame` worklet.

```ts
const { textRecognition } = useTextRecognition({
  language: 'LATIN',
  scaleFactor: 1,
  invertColors: false,
});

const frameOutput = useFrameOutput({
  onFrame(frame) {
    'worklet';

    try {
      const result = textRecognition(frame, {
        outputOrientation: 'portrait',
      });
      console.log(result.text);
    } finally {
      frame.dispose();
    }
  },
});
```

### Frame options

- `language?: 'LATIN' | 'CHINESE' | 'DEVANAGARI' | 'JAPANESE' | 'KOREAN'`
- `scaleFactor?: number` (`0.9`-`1.0`)
- `invertColors?: boolean`
- `roi?: RegionOfInterest` (crop processing to a rectangle of the frame; see the [Region of Interest](../README.md#region-of-interest) section in the main README)
- `frameProcessInterval?: number` (deprecated compatibility field; v2 does not use it to throttle processing)

### Frame arguments

- `outputOrientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (iOS only)

## Static Image Processing

Use `processImageTextRecognition(uri, options)` for local images. Each call
creates a Nitro recognizer with `options` and runs recognition asynchronously.

```ts
const result = await processImageTextRecognition(imageUri, {
  language: 'LATIN',
  orientation: 'portrait',
  invertColors: false,
  scaleFactor: 1,
});
```

### Image options

- `language?: 'LATIN' | 'CHINESE' | 'DEVANAGARI' | 'JAPANESE' | 'KOREAN'`
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

## Result shape

`TextRecognitionResult` is a nested hierarchy: text → blocks → lines → elements
(→ symbols on Android). Every level carries its own `bounds`/`corners`
geometry, already mapped back to full source coordinates (see
[Region of Interest](../README.md#region-of-interest)).

- `text: string` — the full recognized text.
- `blocks: TextBlock[]`
  - `text: string`, `bounds`, `corners`, `languages: string[]` (ISO 639-1/639-2)
  - `lines: TextLine[]`
    - `text: string`, `bounds`, `corners`, `languages: string[]`
    - `confidence: number | null`, `angle: number | null` (Android only)
    - `elements: TextElement[]`
      - `text: string`, `bounds`, `corners`, `languages: string[]`
      - `confidence: number | null`, `angle: number | null` (Android only)
      - `symbols: TextSymbol[]` (Android only) — `text`, `bounds`, `corners`, `confidence`, `angle`

## iOS orientation note

For frame processing on iOS, pass `outputOrientation` to ensure ML Kit receives the correct image orientation.
Android rotation is handled automatically.

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

- Always call `frame.dispose()` exactly once for every frame, including frames
  you skip; keep disposal in a `finally` block around the whole callback.
- `frameProcessInterval` has no throttling effect in v2. Decide whether to call
  the recognizer inside `onFrame`, while still disposing every frame.
- Keep `scaleFactor` as high as possible for OCR accuracy.
