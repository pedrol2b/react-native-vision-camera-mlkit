import { Platform } from 'react-native';
import { FEATURE_ERROR_MAP } from '../shared/constants';
import type { BarcodeScanningOptions } from '../features/barcode-scanning/types';
import type { TextRecognitionOptions } from '../features/text-recognition/types';
import { MLKIT_FEATURE_KEYS } from './constants';
import { validateRegionOfInterest } from './validateRegionOfInterest';
import { VisionCameraMLKit } from './VisionCameraMLKit';
import type { MLKitBaseOptions, MLKitFeature } from './types';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const ORIENTATIONS = new Set([
  'portrait',
  'portrait-upside-down',
  'landscape-left',
  'landscape-right',
]);
const TEXT_LANGUAGES = new Set([
  'LATIN',
  'CHINESE',
  'DEVANAGARI',
  'JAPANESE',
  'KOREAN',
]);
const BARCODE_FORMATS = new Set([
  'UNKNOWN',
  'ALL_FORMATS',
  'CODE_128',
  'CODE_39',
  'CODE_93',
  'CODABAR',
  'DATA_MATRIX',
  'EAN_13',
  'EAN_8',
  'ITF',
  'QR_CODE',
  'UPC_A',
  'UPC_E',
  'PDF417',
  'AZTEC',
]);

const hasDefinedOption = (
  options: Record<string, unknown>,
  key: string
): boolean =>
  Object.prototype.hasOwnProperty.call(options, key) &&
  options[key] !== undefined;

const invalidOption = (key: string): never => {
  throw new Error(`Invalid MLKit plugin option "${key}".`);
};

const validateBaseOptions = (options: Record<string, unknown>): void => {
  if (
    hasDefinedOption(options, 'scaleFactor') &&
    (typeof options.scaleFactor !== 'number' ||
      !Number.isFinite(options.scaleFactor))
  ) {
    invalidOption('scaleFactor');
  }
  if (
    hasDefinedOption(options, 'invertColors') &&
    typeof options.invertColors !== 'boolean'
  ) {
    invalidOption('invertColors');
  }
  if (
    hasDefinedOption(options, 'frameProcessInterval') &&
    (typeof options.frameProcessInterval !== 'number' ||
      !Number.isSafeInteger(options.frameProcessInterval) ||
      options.frameProcessInterval < 0)
  ) {
    invalidOption('frameProcessInterval');
  }
  if (
    hasDefinedOption(options, 'orientation') &&
    !ORIENTATIONS.has(options.orientation as string)
  ) {
    invalidOption('orientation');
  }
};

const validateFeatureOptions = (
  feature: MLKitFeature,
  options: Record<string, unknown>
): void => {
  if (
    feature === MLKIT_FEATURE_KEYS.TEXT_RECOGNITION &&
    hasDefinedOption(options, 'language') &&
    !TEXT_LANGUAGES.has(options.language as string)
  ) {
    invalidOption('language');
  }
  if (feature !== MLKIT_FEATURE_KEYS.BARCODE_SCANNING) return;

  if (
    hasDefinedOption(options, 'formats') &&
    (!Array.isArray(options.formats) ||
      !options.formats.every(
        (format) => typeof format === 'string' && BARCODE_FORMATS.has(format)
      ))
  ) {
    invalidOption('formats');
  }
  if (
    hasDefinedOption(options, 'enableAllPotentialBarcodes') &&
    typeof options.enableAllPotentialBarcodes !== 'boolean'
  ) {
    invalidOption('enableAllPotentialBarcodes');
  }
};

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
   * @param {unknown} options - Options for the plugin.
   * @returns The initialized plugin.
   */
  static initPlugin(feature: MLKitFeature, options: unknown) {
    PluginFactory.assertFeatureAvailable(feature);

    if (!isPlainObject(options)) {
      throw new Error('Invalid MLKit plugin options: expected a plain object.');
    }

    validateBaseOptions(options);
    validateFeatureOptions(feature, options);

    if (
      Object.prototype.hasOwnProperty.call(options, 'roi') &&
      options.roi !== undefined
    ) {
      validateRegionOfInterest(options.roi);
    }

    const validatedOptions = options as MLKitBaseOptions;

    switch (feature) {
      case MLKIT_FEATURE_KEYS.TEXT_RECOGNITION:
        return VisionCameraMLKit.createTextRecognizer(
          validatedOptions as TextRecognitionOptions
        );
      case MLKIT_FEATURE_KEYS.BARCODE_SCANNING:
        return VisionCameraMLKit.createBarcodeScanner(
          validatedOptions as BarcodeScanningOptions
        );
      default:
        throw new Error(PluginFactory.getFeatureErrorMessage(feature));
    }
  }

  /**
   * Check if a specific MLKit feature is available at runtime.
   * @param {MLKitFeature} feature - The MLKit feature to check.
   * @returns {boolean} True if the feature is available, false otherwise.
   */
  static isFeatureAvailable(feature: MLKitFeature): boolean {
    try {
      return VisionCameraMLKit.isFeatureAvailable(feature);
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
