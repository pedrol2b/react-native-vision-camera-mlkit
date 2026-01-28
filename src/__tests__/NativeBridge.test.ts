import { MLKIT_FEATURE_KEYS } from '../core/constants';
import type { MLKitFeature } from '../core/types';
import { INVALID_URI_ERROR, MISSING_MODULE_ERROR } from '../shared/constants';

const feature: MLKitFeature = MLKIT_FEATURE_KEYS.TEXT_RECOGNITION;
const createBridge = (
  platform: 'ios' | 'android',
  moduleMock: { processImage?: jest.Mock } | undefined
) => {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: {
      OS: platform,
      select: (options: Record<string, string | undefined>) =>
        options[platform] ?? options.default,
    },
  }));
  jest.doMock('../VisionCameraMLKitSpec', () => ({
    __esModule: true,
    default: moduleMock,
  }));

  return require('../core/NativeBridge')
    .NativeBridge as typeof import('../core/NativeBridge').NativeBridge;
};

describe('NativeBridge', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('throws when the native module is missing', async () => {
    const NativeBridge = createBridge('ios', undefined);

    await expect(
      NativeBridge.processImage(feature, 'file://image.jpg')
    ).rejects.toThrow(MISSING_MODULE_ERROR);
  });

  it('rejects invalid image URIs', async () => {
    const processImage = jest.fn().mockResolvedValue({});
    const NativeBridge = createBridge('android', { processImage });

    await expect(NativeBridge.processImage(feature, '   ')).rejects.toThrow(
      INVALID_URI_ERROR
    );
    expect(processImage).not.toHaveBeenCalled();
  });

  it('strips file prefixes on iOS', async () => {
    const result = { ok: true };
    const processImage = jest.fn().mockResolvedValue(result);
    const NativeBridge = createBridge('ios', { processImage });
    const response = await NativeBridge.processImage(
      feature,
      'file://path/to/image.jpg',
      { orientation: 'portrait' }
    );

    expect(processImage).toHaveBeenCalledWith(feature, 'path/to/image.jpg', {
      orientation: 'portrait',
    });
    expect(response).toBe(result);
  });

  it('adds file prefixes on Android for bare paths', async () => {
    const processImage = jest.fn().mockResolvedValue({});
    const NativeBridge = createBridge('android', { processImage });

    await NativeBridge.processImage(feature, '/tmp/image.jpg');

    expect(processImage).toHaveBeenCalledWith(
      feature,
      'file:///tmp/image.jpg',
      {}
    );
  });
});
