import type {
  TextRecognitionImageOptions,
  TextRecognitionResult,
} from '../features/text-recognition';
import type { BarcodeScanningImageOptions } from '../features/barcode-scanning';
import type { BarcodeScannerResult } from '../specs/BarcodeScannerTypes';

type StaticImageApis = Pick<
  typeof import('../features/text-recognition') &
    typeof import('../features/barcode-scanning'),
  'processImageTextRecognition' | 'processImageBarcodeScanning'
>;

type StaticTextRecognizer = {
  recognizeImage(uri: string): Promise<TextRecognitionResult>;
  dispose(): void;
};

type StaticBarcodeScanner = {
  recognizeImage(uri: string): Promise<BarcodeScannerResult>;
  dispose(): void;
};

type StaticNitroRoot = {
  isFeatureAvailable(feature: string): boolean;
  createTextRecognizer(
    options: TextRecognitionImageOptions
  ): StaticTextRecognizer;
  createBarcodeScanner(
    options: BarcodeScanningImageOptions
  ): StaticBarcodeScanner;
};

const loadStaticImageApis = () => {
  jest.resetModules();

  const recognizeTextImage = jest.fn<
    Promise<TextRecognitionResult>,
    [uri: string]
  >();
  const recognizeBarcodeImage = jest.fn<
    Promise<BarcodeScannerResult>,
    [uri: string]
  >();
  const disposeTextRecognizer = jest.fn();
  const disposeBarcodeScanner = jest.fn();
  const textRecognizer: StaticTextRecognizer = {
    recognizeImage: recognizeTextImage,
    dispose: disposeTextRecognizer,
  };
  const barcodeScanner: StaticBarcodeScanner = {
    recognizeImage: recognizeBarcodeImage,
    dispose: disposeBarcodeScanner,
  };
  const staticNitroRoot = {
    isFeatureAvailable: jest.fn(() => true),
    createTextRecognizer: jest.fn<
      StaticTextRecognizer,
      [options: TextRecognitionImageOptions]
    >(() => textRecognizer),
    createBarcodeScanner: jest.fn<
      StaticBarcodeScanner,
      [options: BarcodeScanningImageOptions]
    >(() => barcodeScanner),
  } satisfies StaticNitroRoot;
  const { createTextRecognizer, createBarcodeScanner } = staticNitroRoot;
  const legacyNativeModuleAccess = jest.fn(() => {
    throw new Error(
      'Static image processing must not use a legacy native module'
    );
  });

  jest.doMock('../core/VisionCameraMLKit', () => ({
    __esModule: true,
    VisionCameraMLKit: staticNitroRoot,
  }));
  jest.doMock('react-native', () => ({
    Platform: {
      OS: 'ios',
      select: (options: Record<string, string | undefined>) =>
        options.ios ?? options.default,
    },
    NativeModules: new Proxy(
      {},
      {
        get: legacyNativeModuleAccess,
      }
    ),
    TurboModuleRegistry: {
      getEnforcing: legacyNativeModuleAccess,
    },
  }));

  const textRecognition = require('../features/text-recognition') as Pick<
    StaticImageApis,
    'processImageTextRecognition'
  >;
  const barcodeScanning = require('../features/barcode-scanning') as Pick<
    StaticImageApis,
    'processImageBarcodeScanning'
  >;

  return {
    ...textRecognition,
    ...barcodeScanning,
    createTextRecognizer,
    createBarcodeScanner,
    recognizeTextImage,
    recognizeBarcodeImage,
    disposeTextRecognizer,
    disposeBarcodeScanner,
    legacyNativeModuleAccess,
  };
};

describe('static image recognition through Nitro', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('creates a configured text recognizer and recognizes the image URI', async () => {
    const {
      processImageTextRecognition,
      createTextRecognizer,
      recognizeTextImage,
      disposeTextRecognizer,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const result: TextRecognitionResult = { text: 'Olá, 世界', blocks: [] };
    const options: TextRecognitionImageOptions = {
      language: 'JAPANESE',
      orientation: 'landscape-right',
      scaleFactor: 0.9,
      invertColors: true,
      roi: {
        x: 0.1,
        y: 0.2,
        width: 0.5,
        height: 0.4,
        unit: 'normalized',
      },
    };
    recognizeTextImage.mockResolvedValue(result);

    const response = await processImageTextRecognition(
      'file:///tmp/receipt-日本語.jpg',
      options
    );

    expect(createTextRecognizer).toHaveBeenCalledWith(options);
    expect(recognizeTextImage).toHaveBeenCalledWith(
      'file:///tmp/receipt-日本語.jpg'
    );
    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeTextRecognizer).toHaveBeenCalledTimes(1);
    expect(response).toBe(result);
  });

  it('creates a configured barcode scanner and recognizes the image URI', async () => {
    const {
      processImageBarcodeScanning,
      createBarcodeScanner,
      recognizeBarcodeImage,
      disposeBarcodeScanner,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const result: BarcodeScannerResult = { barcodes: [] };
    const options: BarcodeScanningImageOptions = {
      formats: ['QR_CODE', 'EAN_13'],
      enableAllPotentialBarcodes: true,
      orientation: 'portrait',
      scaleFactor: 0.95,
      invertColors: true,
      roi: { x: 20, y: 40, width: 200, height: 100, unit: 'pixel' },
    };
    recognizeBarcodeImage.mockResolvedValue(result);

    const response = await processImageBarcodeScanning(
      'file:///tmp/qr-code.png',
      options
    );

    expect(createBarcodeScanner).toHaveBeenCalledWith(options);
    expect(recognizeBarcodeImage).toHaveBeenCalledWith(
      'file:///tmp/qr-code.png'
    );
    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeBarcodeScanner).toHaveBeenCalledTimes(1);
    expect(response).toEqual(result);
  });

  it('configures both recognizers with empty defaults when options are omitted', async () => {
    const {
      processImageTextRecognition,
      processImageBarcodeScanning,
      createTextRecognizer,
      createBarcodeScanner,
      recognizeTextImage,
      recognizeBarcodeImage,
      disposeTextRecognizer,
      disposeBarcodeScanner,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    recognizeTextImage.mockResolvedValue({ text: '', blocks: [] });
    recognizeBarcodeImage.mockResolvedValue({ barcodes: [] });

    await processImageTextRecognition('file:///tmp/empty-text.png');
    await processImageBarcodeScanning('file:///tmp/empty-barcode.png');

    expect(createTextRecognizer).toHaveBeenCalledWith({});
    expect(createBarcodeScanner).toHaveBeenCalledWith({});
    expect(recognizeTextImage).toHaveBeenCalledWith(
      'file:///tmp/empty-text.png'
    );
    expect(recognizeBarcodeImage).toHaveBeenCalledWith(
      'file:///tmp/empty-barcode.png'
    );
    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeTextRecognizer).toHaveBeenCalledTimes(1);
    expect(disposeBarcodeScanner).toHaveBeenCalledTimes(1);
  });

  it('propagates asynchronous recognizer errors without falling back to the legacy bridge', async () => {
    const {
      processImageTextRecognition,
      recognizeTextImage,
      disposeTextRecognizer,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const failure = new Error('The image could not be read');
    recognizeTextImage.mockRejectedValue(failure);

    await expect(
      processImageTextRecognition('file:///tmp/unreadable.jpg')
    ).rejects.toBe(failure);

    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeTextRecognizer).toHaveBeenCalledTimes(1);
  });

  it('propagates asynchronous barcode scanner errors without falling back to the legacy bridge', async () => {
    const {
      processImageBarcodeScanning,
      recognizeBarcodeImage,
      disposeBarcodeScanner,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const failure = new Error('The barcode image could not be read');
    recognizeBarcodeImage.mockRejectedValue(failure);

    await expect(
      processImageBarcodeScanning('file:///tmp/unreadable-barcode.jpg')
    ).rejects.toBe(failure);

    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeBarcodeScanner).toHaveBeenCalledTimes(1);
  });
});
