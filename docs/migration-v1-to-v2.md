# Migrating from v1 to v2

v2 moves the library to React Native 0.86, VisionCamera v5 frame outputs, and
Nitro Modules. It supports iOS 15.1+ and Android SDK 24+. VisionCamera v4 users
must remain on a v1 tag until their camera integration can move to v5.

## Dependency changes

Install the v2 native dependencies:

```sh
npm install react-native-vision-camera-mlkit@^2 \
  react-native-vision-camera@^5 \
  react-native-nitro-modules
cd ios && pod install
```

Live-frame recognition also needs VisionCamera's frame-output Worklets
dependencies:

```sh
npm install react-native-vision-camera-worklets react-native-worklets
```

Configure `react-native-worklets/plugin` in `babel.config.js`. Remove the v1
`react-native-worklets-core` dependency and Babel plugin if nothing else in
your app uses them. Static-image APIs do not need Worklets or a camera, but the
package still requires VisionCamera v5 and Nitro Modules at build time.

## Live-frame API changes

Replace the v1 `useFrameProcessor` integration with VisionCamera v5's
`useFrameOutput`. Call `textRecognition(frame, args)` or
`barcodeScanning(frame, args)` directly in its `onFrame` worklet.

- Remove `runAsync(frame, ...)` and `runAtTargetFps(...)`; those v1 patterns do
  not belong to the v5 frame-output API.
- Dispose every delivered frame exactly once, including skipped or failed
  frames. Put `frame.dispose()` in a `finally` block around the whole callback.
- Remove `frameProcessInterval`. It remains in the type for compatibility but
  has no throttling effect in the v2 Nitro recognizers. Make the call/skip
  decision inside `onFrame` and dispose either way.
- Continue passing `outputOrientation` for iOS live frames when required.

See the complete [text recognition](text-recognition.md) and
[barcode scanning](barcode-scanning.md) examples.

## Static-image behavior

The public functions remain `processImageTextRecognition(uri, options)` and
`processImageBarcodeScanning(uri, options)`, but v2 runs them through configured
Nitro recognizers. The supplied language, formats, orientation, scale, color
inversion, and ROI options configure that recognizer.

Only local, readable images are accepted. iOS supports absolute paths and
`file://` URIs. Android additionally supports `content://` URIs. Remote URLs
and platform-library schemes such as `ph://` are not supported. Omit
`orientation` to use EXIF metadata; pass it only to override missing or wrong
metadata.

## Feature availability

v2 implements text recognition and barcode scanning. Both are enabled by
default, including all OCR language models. Other ML Kit feature keys are
reserved, disabled roadmap configuration and do not expose public APIs in v2.

## v1 maintenance

Published v1 tags remain available for applications that still use
VisionCamera v4, but v1 is not the active development line. The project does
not currently publish a security or critical-fix support guarantee for v1;
plan to migrate to v2 rather than relying on future v1 releases.
