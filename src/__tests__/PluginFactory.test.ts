import { MLKIT_FEATURE_KEYS } from '../core/constants';

const loadPluginFactory = () => {
  jest.resetModules();
  const isFeatureAvailable = jest.fn(() => true);

  jest.doMock('react-native', () => ({
    Platform: {
      OS: 'ios',
      select: (options: Record<string, string | undefined>) =>
        options.ios ?? options.default,
    },
  }));
  jest.doMock('../core/VisionCameraMLKit', () => ({
    VisionCameraMLKit: {
      isFeatureAvailable,
      createTextRecognizer: jest.fn(),
      createBarcodeScanner: jest.fn(),
    },
  }));

  return {
    PluginFactory: require('../core/PluginFactory')
      .PluginFactory as typeof import('../core/PluginFactory').PluginFactory,
    isFeatureAvailable,
  };
};

describe('PluginFactory.initPlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it.each([null, [], 'not-an-object', 42])(
    'rejects invalid options before reading roi: %p',
    (options) => {
      const { PluginFactory, isFeatureAvailable } = loadPluginFactory();

      expect(() =>
        PluginFactory.initPlugin(MLKIT_FEATURE_KEYS.TEXT_RECOGNITION, options)
      ).toThrow('Invalid MLKit plugin options: expected a plain object.');
      expect(isFeatureAvailable).toHaveBeenCalledWith(
        MLKIT_FEATURE_KEYS.TEXT_RECOGNITION
      );
    }
  );

  it.each([
    { scaleFactor: Number.NaN },
    { scaleFactor: Number.POSITIVE_INFINITY },
    { scaleFactor: '0.9' },
    { invertColors: 'true' },
    { frameProcessInterval: -1 },
    { frameProcessInterval: 1.5 },
    { orientation: 'sideways' },
  ])('rejects invalid base options: %p', (options) => {
    const { PluginFactory } = loadPluginFactory();

    expect(() =>
      PluginFactory.initPlugin(MLKIT_FEATURE_KEYS.TEXT_RECOGNITION, options)
    ).toThrow('Invalid MLKit plugin option');
  });

  it('rejects invalid text-recognition language values', () => {
    const { PluginFactory } = loadPluginFactory();

    expect(() =>
      PluginFactory.initPlugin(MLKIT_FEATURE_KEYS.TEXT_RECOGNITION, {
        language: 'KLINGON',
      })
    ).toThrow('Invalid MLKit plugin option "language".');
  });

  it.each([
    { formats: 'QR_CODE' },
    { formats: ['NOT_A_FORMAT'] },
    { enableAllPotentialBarcodes: 1 },
  ])('rejects invalid barcode options: %p', (options) => {
    const { PluginFactory } = loadPluginFactory();

    expect(() =>
      PluginFactory.initPlugin(MLKIT_FEATURE_KEYS.BARCODE_SCANNING, options)
    ).toThrow('Invalid MLKit plugin option');
  });
});
