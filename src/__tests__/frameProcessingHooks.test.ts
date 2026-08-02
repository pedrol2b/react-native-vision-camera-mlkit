import type { Frame } from 'react-native-vision-camera';
import { MLKIT_FEATURE_KEYS } from '../core/constants';
import type { TextRecognitionResult } from '../features/text-recognition/types';
import type { BarcodeScanningResult } from '../features/barcode-scanning/types';

const loadFrameProcessingHooks = () => {
  jest.resetModules();

  const textResult: TextRecognitionResult = {
    text: 'Olá, 世界',
    blocks: [],
  };
  const barcodeResult: BarcodeScanningResult = { barcodes: [] };
  const recognizeText = jest.fn(() => textResult);
  const recognizeBarcodes = jest.fn(() => barcodeResult);
  const useMLKitPlugin = jest.fn((feature: string) =>
    feature === MLKIT_FEATURE_KEYS.TEXT_RECOGNITION
      ? { recognize: recognizeText }
      : { recognize: recognizeBarcodes }
  );
  const useMemo = jest.fn((factory: () => unknown) => factory());

  jest.doMock('react', () => ({ useMemo }));
  jest.doMock('../hooks/useMLKitPlugin', () => ({ useMLKitPlugin }));
  jest.doMock('../core/PluginFactory', () => ({
    PluginFactory: { initPlugin: jest.fn() },
  }));

  return {
    useTextRecognition: require('../features/text-recognition')
      .useTextRecognition as typeof import('../features/text-recognition').useTextRecognition,
    useBarcodeScanning: require('../features/barcode-scanning')
      .useBarcodeScanning as typeof import('../features/barcode-scanning').useBarcodeScanning,
    recognizeText,
    recognizeBarcodes,
    textResult,
    barcodeResult,
    useMLKitPlugin,
    useMemo,
  };
};

describe('frame processing hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('creates a text recognizer and forwards frame-processing arguments', () => {
    const {
      useTextRecognition,
      recognizeText,
      textResult,
      useMLKitPlugin,
      useMemo,
    } = loadFrameProcessingHooks();
    const options = { language: 'LATIN' as const };
    const frame = { width: 1920, height: 1080 } as Frame;
    const args = { outputOrientation: 'landscape-right' as const };

    const plugin = useTextRecognition(options);
    const result = plugin.textRecognition(frame, args);

    expect(useMLKitPlugin).toHaveBeenCalledWith(
      MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
      options
    );
    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [
      { recognize: recognizeText },
    ]);
    expect(recognizeText).toHaveBeenCalledWith(frame, args);
    expect(result).toBe(textResult);
  });

  it('creates a barcode scanner with defaults and supplies empty arguments', () => {
    const {
      useBarcodeScanning,
      recognizeBarcodes,
      barcodeResult,
      useMLKitPlugin,
    } = loadFrameProcessingHooks();
    const frame = { width: 640, height: 480 } as Frame;

    const plugin = useBarcodeScanning();
    const result = plugin.barcodeScanning(frame);

    expect(useMLKitPlugin).toHaveBeenCalledWith(
      MLKIT_FEATURE_KEYS.BARCODE_SCANNING,
      {}
    );
    expect(recognizeBarcodes).toHaveBeenCalledWith(frame, {});
    expect(result).toBe(barcodeResult);
  });
});
