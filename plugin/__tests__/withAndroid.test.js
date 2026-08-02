const { insertAndroidConfig } = require('../withAndroid');

const BASE_GRADLE = `buildscript {\n  ext {\n    kotlinVersion = "1.9.0"\n  }\n}\n\napply plugin: "com.android.application"\n`;

describe('insertAndroidConfig', () => {
  test('prepends the ext block with the given config', () => {
    const result = insertAndroidConfig(
      BASE_GRADLE,
      { textRecognition: true, faceDetection: false },
      { language: 'groovy' }
    );

    expect(result).toContain('ext["react-native-vision-camera-mlkit"] = [');
    expect(result).toContain('textRecognition: true,');
    expect(result).toContain('faceDetection: false,');
    expect(
      result.indexOf('ext["react-native-vision-camera-mlkit"]')
    ).toBeLessThan(result.indexOf('buildscript'));
  });

  test('is idempotent - running twice does not duplicate the block', () => {
    const once = insertAndroidConfig(
      BASE_GRADLE,
      { textRecognition: true },
      {
        language: 'groovy',
      }
    );
    const twice = insertAndroidConfig(
      once,
      { textRecognition: true },
      {
        language: 'groovy',
      }
    );

    expect(twice).toBe(once);
    expect(
      once.split(
        'react-native-vision-camera-mlkit selective ML Kit dependencies'
      ).length - 1
    ).toBe(1);
  });

  test('throws for Kotlin DSL build.gradle.kts', () => {
    expect(() =>
      insertAndroidConfig(
        BASE_GRADLE,
        { textRecognition: true },
        { language: 'kt' }
      )
    ).toThrow(/Kotlin DSL/);
  });
});
