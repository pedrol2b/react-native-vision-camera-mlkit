import { Platform } from 'react-native';
import { VisionCameraProxy } from 'react-native-vision-camera';
import { FEATURE_ERROR_MAP, LINKING_ERROR } from '../shared/constants';
import { MLKIT_FEATURE_KEYS } from './constants';
import type { MLKitBaseOptions, MLKitFeature } from './types';

/**
 * Factory class for managing MLKit Vision Camera plugins
 */
export class PluginFactory {
  /**
   * Get detailed error message for missing feature.
   * @param {MLKitFeature} feature - The MLKit feature.
   * @returns {string} Detailed error message with setup instructions.
   */
  static getFeatureErrorMessage(feature: MLKitFeature): string {
    const baseMessage = FEATURE_ERROR_MAP[feature];
    const configKey = PluginFactory.getFeatureConfigKey(feature);

    const setupInstructions =
      Platform.OS === 'ios'
        ? `

Setup Instructions for iOS:
1. Edit ios/Podfile
2. Add configuration at the top of the file:

$VisionCameraMLKit = {
  :${configKey} => true,
}

3. Run: cd ios && pod install
4. Rebuild your app
`
        : `

Setup Instructions for Android:
1. Edit android/build.gradle
2. Add configuration in buildscript.ext block:

buildscript {
  ext {
    set('react-native-vision-camera-mlkit', [
      mlkit: [
        ${configKey}: true,
      ]
    ])
  }
}

3. Rebuild your app
`;

    return baseMessage + setupInstructions;
  }

  /**
   * Get config key for a feature.
   * @param {MLKitFeature} feature - The MLKit feature.
   * @returns {string} The config key string.
   */
  static getFeatureConfigKey(feature: MLKitFeature): string {
    return feature.charAt(0).toLowerCase() + feature.slice(1);
  }

  /**
   * Initializes the Vision Camera plugin for a given feature.
   * @param {MLKitFeature} feature - The MLKit feature to initialize.
   * @param {MLKitBaseOptions} options - Options for the plugin.
   * @returns The initialized plugin.
   */
  static initPlugin(feature: MLKitFeature, options: MLKitBaseOptions) {
    PluginFactory.assertFeatureAvailable(feature);

    const plugin = VisionCameraProxy.initFrameProcessorPlugin(feature, options);

    if (!plugin) {
      throw new Error(LINKING_ERROR);
    }

    return plugin;
  }

  /**
   * Check if a specific MLKit feature is available at runtime.
   * @param {MLKitFeature} feature - The MLKit feature to check.
   * @returns {boolean} True if the feature is available, false otherwise.
   */
  static isFeatureAvailable(feature: MLKitFeature): boolean {
    try {
      const plugin = VisionCameraProxy.initFrameProcessorPlugin(feature, {});
      return plugin !== undefined && plugin !== null;
    } catch {
      return false;
    }
  }

  /**
   * Assert that a feature is available, throwing an error if not.
   * @param {MLKitFeature} feature - The MLKit feature to check.
   * @throws {Error} If the feature is not available.
   */
  static assertFeatureAvailable(feature: MLKitFeature): void {
    if (!PluginFactory.isFeatureAvailable(feature)) {
      throw new Error(PluginFactory.getFeatureErrorMessage(feature));
    }
  }

  /**
   * Get a list of all available MLKit features.
   * @returns {MLKitFeature[]} Array of available feature names.
   */
  static getAvailableFeatures(): MLKitFeature[] {
    return Object.values(MLKIT_FEATURE_KEYS).filter((feature) =>
      PluginFactory.isFeatureAvailable(feature)
    );
  }
}
