const { insertIOSConfig } = require('../withIOS');

const BASE_PODFILE = `require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")\n\nplatform :ios, '15.1'\n\ntarget 'ExampleApp' do\n  use_expo_modules!\nend\n`;

describe('insertIOSConfig', () => {
  test('inserts the hash before the target block, dropping Android-only keys', () => {
    const result = insertIOSConfig(BASE_PODFILE, {
      textRecognition: true,
      faceMeshDetection: true,
      subjectSegmentation: true,
      documentScanner: true,
      barcodeScanning: false,
    });

    expect(result).toContain('$VisionCameraMLKit = {');
    expect(result).toContain("'textRecognition' => true,");
    expect(result).toContain("'barcodeScanning' => false,");
    expect(result).not.toContain('faceMeshDetection');
    expect(result).not.toContain('subjectSegmentation');
    expect(result).not.toContain('documentScanner');
    expect(result.indexOf('$VisionCameraMLKit')).toBeLessThan(
      result.indexOf("target 'ExampleApp'")
    );
  });

  test('is idempotent - running twice does not duplicate the block', () => {
    const once = insertIOSConfig(BASE_PODFILE, { textRecognition: true });
    const twice = insertIOSConfig(once, { textRecognition: true });

    expect(twice).toBe(once);
    expect(
      once.split(
        'react-native-vision-camera-mlkit selective ML Kit dependencies'
      ).length - 1
    ).toBe(1);
  });

  test('throws when no target block is found', () => {
    expect(() => insertIOSConfig("platform :ios, '15.1'\n", {})).toThrow(
      /could not find a `target` block/
    );
  });
});
