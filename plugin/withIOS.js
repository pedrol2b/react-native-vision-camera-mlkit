const { withPodfile } = require('@expo/config-plugins');
const { ANDROID_ONLY_KEYS } = require('./mlkitConfig');

const MARKER =
  '# react-native-vision-camera-mlkit selective ML Kit dependencies';

/**
 * Renders the iOS subset of `mlkitConfig` (Android-only keys dropped) as the
 * Ruby hash consumers are otherwise told to hand-write before `target` in
 * `ios/Podfile` (see README "ML Kit Models Installation (Selective)").
 */
const toRubyBlock = (mlkitConfig) => {
  const entries = Object.entries(mlkitConfig)
    .filter(([key]) => !ANDROID_ONLY_KEYS.has(key))
    .map(([key, value]) => `  '${key}' => ${value},`)
    .join('\n');

  return `${MARKER}\n$VisionCameraMLKit = {\n${entries}\n}\n`;
};

/**
 * Inserts the selective ML Kit dependency hash into `contents` (the
 * `ios/Podfile` source) before the first `target` block, unless already
 * present. Pure string transform, kept separate from the Expo mod plumbing
 * so it can be unit tested directly.
 * @throws {Error} If no `target` block is found to insert before.
 */
const insertIOSConfig = (contents, mlkitConfig) => {
  if (contents.includes(MARKER)) return contents;

  const targetIndex = contents.search(/^target\s/m);
  if (targetIndex === -1) {
    throw new Error(
      'react-native-vision-camera-mlkit config plugin: could not find a `target` block in ios/Podfile to insert the ML Kit configuration before.'
    );
  }

  return (
    contents.slice(0, targetIndex) +
    toRubyBlock(mlkitConfig) +
    '\n' +
    contents.slice(targetIndex)
  );
};

/**
 * Applies {@link insertIOSConfig} to `ios/Podfile`, mirroring what
 * `VisionCameraMLKit.podspec` reads via the global `$VisionCameraMLKit`
 * variable.
 */
const withVisionCameraMLKitIOS = (config, mlkitConfig) =>
  withPodfile(config, (modConfig) => {
    modConfig.modResults.contents = insertIOSConfig(
      modConfig.modResults.contents,
      mlkitConfig
    );
    return modConfig;
  });

module.exports = { withVisionCameraMLKitIOS, insertIOSConfig };
