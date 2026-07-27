const { parseMLKitConfig, MLKIT_FEATURE_KEYS } = require('../mlkitConfig');

describe('parseMLKitConfig', () => {
  test('keeps only recognized keys, coerced to booleans', () => {
    const result = parseMLKitConfig({
      textRecognition: true,
      barcodeScanning: 1,
      faceDetection: false,
    });

    expect(result).toEqual({
      textRecognition: true,
      barcodeScanning: true,
      faceDetection: false,
    });
  });

  test('omits keys the caller did not set', () => {
    const result = parseMLKitConfig({ textRecognition: true });
    expect(Object.keys(result)).toEqual(['textRecognition']);
  });

  test('defaults to an empty config when no props are given', () => {
    expect(parseMLKitConfig()).toEqual({});
  });

  test('throws on unknown option names', () => {
    expect(() => parseMLKitConfig({ faceDeteciton: true })).toThrow(
      /unknown option\(s\) "faceDeteciton"/
    );
  });

  test('every documented feature key round-trips', () => {
    const allTrue = Object.fromEntries(
      MLKIT_FEATURE_KEYS.map((k) => [k, true])
    );
    expect(parseMLKitConfig(allTrue)).toEqual(allTrue);
  });
});
