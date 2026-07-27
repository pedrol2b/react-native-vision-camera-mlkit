const { createRunOncePlugin } = require('@expo/config-plugins');
const { name, version } = require('../package.json');
const { parseMLKitConfig } = require('./mlkitConfig');
const { withVisionCameraMLKitAndroid } = require('./withAndroid');
const { withVisionCameraMLKitIOS } = require('./withIOS');

/**
 * Expo config plugin mirroring this library's selective ML Kit dependency
 * flags (see README "ML Kit Models Installation (Selective)") into the
 * generated `android/build.gradle` and `ios/Podfile` during `expo prebuild`,
 * so Expo users don't have to hand-edit native config.
 * @throws {Error} If `props` contains an option outside the documented
 * ML Kit feature flags.
 */
const withVisionCameraMLKit = (config, props = {}) => {
  const mlkitConfig = parseMLKitConfig(props);
  config = withVisionCameraMLKitAndroid(config, mlkitConfig);
  config = withVisionCameraMLKitIOS(config, mlkitConfig);
  return config;
};

module.exports = createRunOncePlugin(withVisionCameraMLKit, name, version);
