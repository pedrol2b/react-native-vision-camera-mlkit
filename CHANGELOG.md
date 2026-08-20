# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-08-20

### Fixed

- iOS: text recognition failed to build whenever any language model was
  disabled through the selective ML Kit install. Each `case` of the
  `switch` over `DomainTextRecognitionLanguage` was wrapped in its own
  `#if MLKIT_TEXT_RECOGNITION*` flag, so any partial selection compiled a
  case out while the enum still declared all five, leaving the switch
  non-exhaustive (`switch must be exhaustive`). Only all-enabled or
  all-disabled builds compiled, which defeated the point of selective
  install. The guards now live inside each case body, keeping the switch
  exhaustive under every flag combination. Requesting a language whose
  model was excluded throws a descriptive error naming the configuration
  key to enable, matching the exception Android already raises, rather
  than crashing. (#22)

## [2.0.0] - 2026-08-02

Major, breaking release. Migrates off the legacy TurboModule bridge onto
**VisionCamera v5 + Nitro Modules**. See
[docs/migration-v1-to-v2.md](docs/migration-v1-to-v2.md) before upgrading —
VisionCamera v4 users should stay on a v1 tag until they can move their
camera integration to v5.

### Added

- Live-frame ML Kit recognition wired for both platforms (text recognition
  and barcode scanning) via VisionCamera v5's `useFrameOutput`.
- Barcode scanning added as a full feature family.
- Shared Region-of-Interest (ROI) cropping for text recognition and barcode
  scanning, with results mapped back to full source coordinates.
- Static-image processing (`processImageTextRecognition`/
  `processImageBarcodeScanning`) with EXIF-aware orientation handling and
  full-resolution downsampling.
- Expo config plugin mirroring selective ML Kit configuration into the
  generated `android/build.gradle`/`ios/Podfile` during `expo prebuild`.
- `docs/selective-mlkit-install.md` and `docs/expo-plugin.md`.

### Changed

- React Native bumped to 0.86.
- Text recognition and barcode scanning are each independently installable
  on both platforms: disabling one now genuinely removes its native SDK
  from the build (Gradle conditional source sets on Android, matching
  iOS's existing `#if`-based conditional compilation), not just at runtime.
- Refreshed README, `package.json`, and GitHub repository metadata
  (description, topics) to reflect the Nitro architecture, selective
  install, and the Expo plugin.

### Fixed

- iOS image-orientation correctness for static images.
- Android: full `BoundingBox` field population in Nitro conversions,
  bitmap-recycling and ML Kit detector concurrency fixes, a redundant iOS
  render-pass removal.
- A cross-Worklet-Runtime closure bug affecting frame processing.
- CocoaPods/Bottom Sheet dependency swap in the example app.
- CI: iOS Xcode version pinning, Bundler/Ruby compatibility, Turborepo
  environment-variable passthrough, an `xcodebuild` destination-string
  bug, an Android codegen duplicate-class bug, and a missing Android
  CMake dependency.

## [1.0.0] - 2026-01-28

Complete project rewrite.

## [0.1.0] - 2024-06-03

Initial release.

[Unreleased]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/releases/tag/v0.1.0
