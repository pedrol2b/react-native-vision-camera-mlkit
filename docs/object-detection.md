# Object Detection API

This page documents the Object Detection API in more detail than the README quick-start.

Object detection is implemented by configured Nitro detectors for both live
frames and static images.

ML Kit object detection is class-agnostic: it finds and tracks prominent
objects without needing a trained class for them. Classification is a separate,
coarse label set (`Home good`, `Fashion good`, `Food`, `Place`, `Plant`) that is
off by default.

## Imports

```ts
import { useFrameOutput } from 'react-native-vision-camera';
import {
  useObjectDetection,
  processImageObjectDetection,
  type ObjectDetectionOptions,
  type ObjectDetectionArguments,
  type ObjectDetectionImageOptions,
  type ObjectDetectionResult,
} from 'react-native-vision-camera-mlkit';
```

## Frame Output

Use `useObjectDetection()` for live camera frames, inside a `useFrameOutput`
`onFrame` worklet.

```ts
const { objectDetection } = useObjectDetection({
  detectorMode: 'stream',
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: false,
});

const frameOutput = useFrameOutput({
  onFrame(frame) {
    'worklet';

    try {
      const result = objectDetection(frame, {
        outputOrientation: 'portrait',
      });
      console.log(result.objects.length);
    } finally {
      frame.dispose();
    }
  },
});
```

### Frame options

- `detectorMode?: 'stream' | 'singleImage'` (default `'stream'`)
- `shouldEnableMultipleObjects?: boolean` (default `false`; when `false` only the most prominent object is returned)
- `shouldEnableClassification?: boolean` (default `false`)
- `scaleFactor?: number` (`0.9`-`1.0`)
- `invertColors?: boolean`
- `roi?: RegionOfInterest` (crop processing to a rectangle of the frame; see the [Region of Interest](../README.md#region-of-interest) section in the main README)
- `frameProcessInterval?: number` (deprecated compatibility field; v2 does not use it to throttle processing)

### Frame arguments

- `outputOrientation?: 'portrait' | 'portrait-upside-down' | 'landscape-left' | 'landscape-right'` (iOS only)

## Detector modes

`detectorMode` decides whether the detector keeps identity across frames.

- `'stream'` — low-latency, tolerates partial results, and assigns a
  `trackingId` that stays stable while the same object remains in view. This is
  what makes "keep the box on _this_ object" possible. Use it for live frames.
- `'singleImage'` — treats every call as unrelated, spends more time per image
  and never returns a `trackingId`. Use it for static images.

`processImageObjectDetection` defaults to `'singleImage'`; `useObjectDetection`
defaults to `'stream'`. Both accept an explicit override.

## Static Image Processing

Use `processImageObjectDetection(uri, options)` for local images. Each call
creates a Nitro detector with `options` and runs detection asynchronously.

```ts
const result = await processImageObjectDetection(imageUri, {
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: true,
  orientation: 'portrait',
  scaleFactor: 1,
});
```

### Image options

- `detectorMode?: 'stream' | 'singleImage'` (default `'singleImage'`)
- `shouldEnableMultipleObjects?: boolean`
- `shouldEnableClassification?: boolean`
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

`ObjectDetectionResult` is flat: a list of detected objects, each with geometry
already mapped back to full source coordinates (see
[Region of Interest](../README.md#region-of-interest)).

- `objects: DetectedObject[]`
  - `bounds: BoundingBox` — `top`, `bottom`, `left`, `right`
  - `trackingId: number | null` — `null` in `singleImage` mode, and in `stream`
    mode until tracking settles on the object
  - `labels: ObjectLabel[]` — empty unless `shouldEnableClassification` is `true`
    - `text: string`, `index: number`, `confidence: number`

## Tracking IDs

In `stream` mode the same physical object keeps its `trackingId` across frames,
which is how you tell "the object I was already following" from "a new object
that just entered the frame". Two caveats:

- The first frames of a new object can arrive with `trackingId: null`, before
  tracking settles. Treat `null` as "not yet identified", not as "no object".
- An object that leaves the frame and comes back is a new object, with a new id.

## iOS orientation note

For frame processing on iOS, pass `outputOrientation` to ensure ML Kit receives the correct image orientation.
Android rotation is handled automatically.

`bounds` are reported in the coordinate space of the image ML Kit processed. If
you draw them over a camera preview, map them onto the preview yourself,
accounting for the preview's own rotation and its `cover`/`contain` scaling.

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

Calling the detector while `objectDetection` is disabled in the native ML Kit
configuration throws; see [Selective ML Kit install](./selective-mlkit-install.md).

## Performance guidance

- Always call `frame.dispose()` exactly once for every frame, including frames
  you skip; keep disposal in a `finally` block around the whole callback.
- Leave `shouldEnableClassification` off unless you read the labels. It costs
  latency per frame and the label set is coarse.
- `shouldEnableMultipleObjects: false` is cheaper when you only ever act on the
  most prominent object.
- Detection and text recognition can share one `onFrame`, but they do not have
  to run at the same cadence; running the heavier one less often is usually
  better than lowering the frame rate for both.
