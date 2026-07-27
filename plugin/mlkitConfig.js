/**
 * Shared feature-flag list for the selective ML Kit dependency config,
 * mirroring the Android `rootProject.ext["react-native-vision-camera-mlkit"]`
 * and iOS `$VisionCameraMLKit` keys documented in the README.
 */
const MLKIT_FEATURE_KEYS = [
  'textRecognition',
  'textRecognitionChinese',
  'textRecognitionDevanagari',
  'textRecognitionJapanese',
  'textRecognitionKorean',
  'faceDetection',
  'faceMeshDetection',
  'poseDetection',
  'poseDetectionAccurate',
  'selfieSegmentation',
  'subjectSegmentation',
  'documentScanner',
  'barcodeScanning',
  'imageLabeling',
  'objectDetection',
  'digitalInkRecognition',
];

/** Keys with no iOS ML Kit equivalent - dropped before writing the Podfile hash. */
const ANDROID_ONLY_KEYS = new Set([
  'faceMeshDetection',
  'subjectSegmentation',
  'documentScanner',
]);

/**
 * Validates and normalizes the plugin's `props` into a flat `{ key: boolean }`
 * map, throwing on unknown keys instead of silently ignoring typos.
 * @throws {Error} If `props` contains a key outside {@link MLKIT_FEATURE_KEYS}.
 */
const parseMLKitConfig = (props = {}) => {
  const unknownKeys = Object.keys(props).filter(
    (key) => !MLKIT_FEATURE_KEYS.includes(key)
  );

  if (unknownKeys.length > 0) {
    throw new Error(
      `react-native-vision-camera-mlkit config plugin: unknown option(s) ${unknownKeys
        .map((key) => `"${key}"`)
        .join(', ')}. Valid options: ${MLKIT_FEATURE_KEYS.join(', ')}.`
    );
  }

  const config = {};
  for (const key of MLKIT_FEATURE_KEYS) {
    if (props[key] !== undefined) config[key] = Boolean(props[key]);
  }
  return config;
};

module.exports = { MLKIT_FEATURE_KEYS, ANDROID_ONLY_KEYS, parseMLKitConfig };
