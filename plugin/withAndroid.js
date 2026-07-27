const { withProjectBuildGradle } = require('@expo/config-plugins');

const MARKER =
  '// react-native-vision-camera-mlkit selective ML Kit dependencies';

/**
 * Renders `mlkitConfig` as the Groovy block consumers are otherwise told to
 * hand-write at the top of `android/build.gradle` (see README "ML Kit Models
 * Installation (Selective)").
 */
const toGroovyBlock = (mlkitConfig) => {
  const entries = Object.entries(mlkitConfig)
    .map(([key, value]) => `    ${key}: ${value},`)
    .join('\n');

  return `${MARKER}\next["react-native-vision-camera-mlkit"] = [\n  mlkit: [\n${entries}\n  ]\n]\n`;
};

/**
 * Prepends the selective ML Kit dependency block to `contents` (the
 * project-level `android/build.gradle` source), unless already present.
 * Pure string transform, kept separate from the Expo mod plumbing so it can
 * be unit tested directly.
 * @throws {Error} If `language` isn't Groovy (`.kts` is not supported by this
 * plugin, matching the library's own native config).
 */
const insertAndroidConfig = (contents, mlkitConfig, { language }) => {
  if (language !== 'groovy') {
    throw new Error(
      'react-native-vision-camera-mlkit config plugin only supports Groovy android/build.gradle files, not Kotlin DSL (.kts).'
    );
  }

  if (contents.includes(MARKER)) return contents;

  return `${toGroovyBlock(mlkitConfig)}\n${contents}`;
};

/**
 * Applies {@link insertAndroidConfig} to the project-level
 * `android/build.gradle`, mirroring what `getMLKitConfig()` in the library's
 * own `android/build.gradle` reads via `rootProject.ext`.
 */
const withVisionCameraMLKitAndroid = (config, mlkitConfig) =>
  withProjectBuildGradle(config, (modConfig) => {
    modConfig.modResults.contents = insertAndroidConfig(
      modConfig.modResults.contents,
      mlkitConfig,
      { language: modConfig.modResults.language }
    );
    return modConfig;
  });

module.exports = { withVisionCameraMLKitAndroid, insertAndroidConfig };
