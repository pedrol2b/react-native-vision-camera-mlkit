# Selective ML Kit Installation

This page documents the selective-install configuration in more detail than the README quick-start.

react-native-vision-camera-mlkit is designed to expose the full set of Google
ML Kit vision APIs, but no single app needs all of them. A consumer who only
wants barcode scanning shouldn't have to ship the text-recognition SDK (or
vice versa) — every additional native SDK adds to APK/IPA size. The
`textRecognition` and `barcodeScanning` flags (and the reserved roadmap keys)
let you opt in to only what your app actually uses.

## What "selective" means here

Disabling a feature removes its native SDK from the build **entirely**,
on both platforms — it is not just a runtime gate:

- **Android**: the corresponding `com.google.mlkit:*` Gradle dependency is
  wrapped in `if (mlkitConfig.<flag>) { implementation "..." }` in this
  library's `android/build.gradle`, and the Kotlin source files that touch
  that SDK's types live in a Gradle source set that's only added to the
  compile classpath when the flag is on. When disabled, a lightweight stub
  takes its place so the rest of the module still compiles; that stub is
  never actually reached at runtime.
- **iOS**: the corresponding `GoogleMLKit/*` CocoaPods dependency in
  `VisionCameraMLKit.podspec` is wrapped in the same conditional, and every
  Swift file that touches that SDK's types is wrapped in a matching
  `#if MLKIT_TEXT_RECOGNITION_ANY` / `#if MLKIT_BARCODE_SCANNING` compiler
  condition, so the guarded code (and its imports) is fully elided from
  compilation when the flag is off.

Both platforms give you the same guarantee: disable a feature you don't use,
and its model weights and native SDK genuinely never end up in your binary.

## Feature families

v2 implements two feature families with a public JS/Nitro API:

- `textRecognition` (plus the four optional OCR language variants:
  `textRecognitionChinese`, `textRecognitionDevanagari`,
  `textRecognitionJapanese`, `textRecognitionKorean`)
- `barcodeScanning`

All other configuration keys are reserved for the
[post-v2 roadmap](../README.md#google-ml-kit-vision-features-roadmap):
`faceDetection`, `faceMeshDetection`, `poseDetection`,
`poseDetectionAccurate`, `selfieSegmentation`, `subjectSegmentation`,
`documentScanner`, `imageLabeling`, `objectDetection`,
`digitalInkRecognition`. Enabling one of these keys today does not provide a
public API — there's nothing to selectively install yet for these, since
they aren't implemented.

## Defaults

| Key                         | Default | Notes                                    |
| ---------------------------- | :-----: | ----------------------------------------- |
| `textRecognition`            | `true`  | Latin OCR (the base text-recognition SDK) |
| `textRecognitionChinese`     | `true`  | Adds ~a few MB; disable if unused         |
| `textRecognitionDevanagari`  | `true`  | Adds ~a few MB; disable if unused         |
| `textRecognitionJapanese`    | `true`  | Adds ~a few MB; disable if unused         |
| `textRecognitionKorean`      | `true`  | Adds ~a few MB; disable if unused         |
| `barcodeScanning`            | `true`  |                                            |
| all roadmap keys             | `false` | Reserved, no public API                   |

If you only need barcode scanning, set `textRecognition` (and all four
language variants) to `false`. If you only need Latin-script OCR, keep
`textRecognition: true` and disable the four language variants — that keeps
the base SDK but drops the larger per-language model packages.

## Android (Gradle)

Add this to your app's **root** `android/build.gradle` (not
`android/app/build.gradle`), before the `apply plugin: "com.facebook.react.rootproject"`
line or anywhere at the top level of the file:

```gradle
ext["react-native-vision-camera-mlkit"] = [
  mlkit: [
    textRecognition: true,
    textRecognitionChinese: false,
    textRecognitionDevanagari: false,
    textRecognitionJapanese: false,
    textRecognitionKorean: false,
    barcodeScanning: false,
  ]
]
```

Omit any key to keep its default. This library's own `android/build.gradle`
reads `rootProject.ext["react-native-vision-camera-mlkit"].mlkit`, merges it
over its defaults, and uses the result to both pick the compile-time source
set (see above) and generate `BuildConfig` fields that gate the feature at
runtime as a second layer of protection.

## iOS (Podfile)

Add a `$VisionCameraMLKit` hash to your `ios/Podfile`, **before** the first
`target` block:

```ruby
$VisionCameraMLKit = {
  'textRecognition' => true,
  'textRecognitionChinese' => false,
  'textRecognitionDevanagari' => false,
  'textRecognitionJapanese' => false,
  'textRecognitionKorean' => false,
  'barcodeScanning' => false,
}
```

Run `pod install` after changing this hash — CocoaPods only re-resolves
dependencies (including conditional ones) on install/update, not on every
build.

Omit any key to keep its default. `VisionCameraMLKit.podspec` reads
`$VisionCameraMLKit` the same way `android/build.gradle` reads
`rootProject.ext`.

## Expo

If you use an Expo prebuild workflow, use this library's config plugin
instead of hand-editing `android/build.gradle`/`ios/Podfile` — see
[Expo Config Plugin](expo-plugin.md).

## Verifying a feature was actually excluded

To confirm a disabled feature's SDK is really gone (not just gated), inspect
the resolved dependency graph after a clean build:

```sh
# Android — run from the app's android/ directory
./gradlew :app:dependencies --configuration debugRuntimeClasspath | grep mlkit

# iOS — check the generated Podfile.lock
grep -A2 "GoogleMLKit" ios/Podfile.lock
```

A disabled feature's `com.google.mlkit:*` / `GoogleMLKit/*` entries should be
absent entirely, not merely present-but-unused.

## Calling a disabled feature at runtime

`useTextRecognition`/`useBarcodeScanning`/`processImageTextRecognition`/
`processImageBarcodeScanning` throw a setup error if the corresponding flag
was disabled at build time — see
[Error Handling](../README.md#error-handling) and the `getAvailableFeatures`/
`isFeatureAvailable`/`assertFeatureAvailable` helpers for checking
availability before rendering feature-dependent UI.
