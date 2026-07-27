# Text Recognition API

This page documents the Text Recognition API in more detail than the README quick-start.

## Imports

```ts
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
- `frameProcessInterval?: number` (deprecated; throttle frames manually inside `onFrame` instead)

### Frame arguments

- `outputOrientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (iOS only)

## Static Image Processing

Use `processImageTextRecognition(uri, options)` for gallery files / local images.

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
- `orientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'`
- `invertColors?: boolean`
- `scaleFactor?: number` (`0.9`-`1.0`)
- `roi?: RegionOfInterest` (crop processing to a rectangle of the image; see the [Region of Interest](../README.md#region-of-interest) section in the main README)

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

For static image processing, promise rejections can use:

- `IMAGE_NOT_FOUND_ERROR`
- `INVALID_URI_ERROR`
- `IMAGE_PROCESSING_FAILED_ERROR`
- `UNSUPPORTED_IMAGE_FORMAT_ERROR`

## Performance guidance

- Always call `frame.dispose()` exactly once per frame inside `onFrame`.
- Throttle by skipping frames manually inside `onFrame` instead of relying on
  a native-side interval.
- Keep `scaleFactor` as high as possible for OCR accuracy.
