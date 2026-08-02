# Expo Config Plugin

This page documents this library's Expo config plugin in more detail than the README quick-start.

If you're using an Expo prebuild workflow (`expo prebuild`, EAS Build, or a
custom dev client), this library ships a config plugin that mirrors the same
[selective ML Kit configuration](selective-mlkit-install.md) into the
generated `android/build.gradle` and `ios/Podfile` automatically, so you
don't have to hand-edit native config after every prebuild.

## Requirements

The plugin depends on `@expo/config-plugins`, which is already a transitive
dependency of `expo` itself — Expo projects have it for free, nothing extra
to install.

## Usage

Add the plugin to your `app.json`/`app.config.js`/`app.config.ts` `plugins`
array, with the same keys documented in
[Selective ML Kit Installation](selective-mlkit-install.md#defaults):

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-vision-camera-mlkit",
        {
          "textRecognition": true,
          "textRecognitionChinese": false,
          "textRecognitionDevanagari": false,
          "textRecognitionJapanese": false,
          "textRecognitionKorean": false,
          "barcodeScanning": false
        }
      ]
    ]
  }
}
```

Or in `app.config.js`:

```js
module.exports = {
  expo: {
    plugins: [
      [
        'react-native-vision-camera-mlkit',
        {
          textRecognition: true,
          barcodeScanning: false,
        },
      ],
    ],
  },
};
```

Any key you omit keeps the library's own default (see
[Defaults](selective-mlkit-install.md#defaults)). Run `npx expo prebuild`
(or let EAS Build run it for you) to regenerate the native projects with
your configuration applied.

## What it actually does

The plugin has two halves, one per platform, both driven by the same
options object:

- **Android** (`withVisionCameraMLKitAndroid`): prepends an
  `ext["react-native-vision-camera-mlkit"] = [ mlkit: [ ... ] ]` Groovy block
  to the top of the generated project-level `android/build.gradle` — the
  exact same block documented for manual installation. This library's own
  `android/build.gradle` reads it via `rootProject.ext` at build time.
- **iOS** (`withVisionCameraMLKitIOS`): inserts a `$VisionCameraMLKit = { ... }`
  Ruby hash into the generated `ios/Podfile`, immediately before the first
  `target` block — again, the same hash documented for manual installation.
  `VisionCameraMLKit.podspec` reads the `$VisionCameraMLKit` global at
  `pod install` time.

Both platform writers are pure string transforms under the hood
(`insertAndroidConfig`/`insertIOSConfig`), so they're easy to reason about
and unit tested directly in this repo (`plugin/__tests__/withAndroid.test.js`,
`plugin/__tests__/withIOS.test.js`).

## Validation

Unknown option keys throw at prebuild time instead of silently being
ignored — a typo like `"textRecogniton": true` fails fast with an error
listing every valid key, rather than quietly doing nothing:

```
react-native-vision-camera-mlkit config plugin: unknown option(s) "textRecogniton". Valid options: textRecognition, textRecognitionChinese, ...
```

## Platform-specific behavior to be aware of

- **Android-only keys are silently dropped for iOS.** `faceMeshDetection`,
  `subjectSegmentation`, and `documentScanner` have no ML Kit iOS
  equivalent, so the plugin omits them from the generated `$VisionCameraMLKit`
  hash entirely rather than writing a key iOS can't use. This isn't an
  error — it's expected, since these are Android-only roadmap features to
  begin with.
- **Only Groovy `android/build.gradle` is supported**, not Kotlin DSL
  (`.kts`). If your Expo project's generated Android build uses `.kts`, the
  plugin throws instead of silently producing a broken file. This mirrors
  the library's own native Android config, which is also Groovy-only.
- **Idempotent across repeated prebuilds.** Both writers check for a marker
  comment (`// react-native-vision-camera-mlkit selective ML Kit dependencies`
  on Android, `# react-native-vision-camera-mlkit selective ML Kit
  dependencies` on iOS) and skip re-inserting if it's already present, so
  running `expo prebuild` more than once — or across a clean vs. non-clean
  prebuild — doesn't duplicate the config block.
- **Runs once per config, even if listed twice.** The plugin is wrapped in
  Expo's `createRunOncePlugin`, so listing it more than once in your
  `plugins` array (e.g. from a nested config) still only applies it a
  single time.
- **Config only, not installation.** The plugin edits `android/build.gradle`
  and `ios/Podfile` — it does not run `pod install` or a Gradle sync for
  you. Follow your normal Expo prebuild/EAS Build workflow after changing
  the plugin's options.

## When you don't need this plugin

If you're not using Expo prebuild (bare React Native, or Expo with a fully
custom native project you maintain by hand), skip the plugin and edit
`android/build.gradle`/`ios/Podfile` directly — see
[Selective ML Kit Installation](selective-mlkit-install.md).
