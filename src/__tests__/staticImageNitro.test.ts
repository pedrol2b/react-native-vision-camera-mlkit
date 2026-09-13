import type {
  TextRecognitionImageOptions,
  TextRecognitionResult,
} from '../features/text-recognition';
import type { BarcodeScanningImageOptions } from '../features/barcode-scanning';
import type { BarcodeScannerResult } from '../specs/BarcodeScannerTypes';
import type {
  ObjectDetectionImageOptions,
  ObjectDetectionResult,
} from '../features/object-detection';

type StaticImageApis = Pick<
  typeof import('../features/text-recognition') &
    typeof import('../features/barcode-scanning') &
    typeof import('../features/object-detection'),
  | 'processImageTextRecognition'
  | 'processImageBarcodeScanning'
  | 'processImageObjectDetection'
>;

type StaticTextRecognizer = {
  recognizeImage(uri: string): Promise<TextRecognitionResult>;
  dispose(): void;
};

type StaticBarcodeScanner = {
  recognizeImage(uri: string): Promise<BarcodeScannerResult>;
  dispose(): void;
};

type StaticObjectDetector = {
  detectImage(uri: string): Promise<ObjectDetectionResult>;
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
  createObjectDetector(
    options: ObjectDetectionImageOptions
  ): StaticObjectDetector;
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
  const detectObjectsImage = jest.fn<
    Promise<ObjectDetectionResult>,
    [uri: string]
  >();
  const disposeTextRecognizer = jest.fn();
  const disposeBarcodeScanner = jest.fn();
  const disposeObjectDetector = jest.fn();
  const textRecognizer: StaticTextRecognizer = {
    recognizeImage: recognizeTextImage,
    dispose: disposeTextRecognizer,
  };
  const barcodeScanner: StaticBarcodeScanner = {
    recognizeImage: recognizeBarcodeImage,
    dispose: disposeBarcodeScanner,
  };
  const objectDetector: StaticObjectDetector = {
    detectImage: detectObjectsImage,
    dispose: disposeObjectDetector,
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
    createObjectDetector: jest.fn<
      StaticObjectDetector,
      [options: ObjectDetectionImageOptions]
    >(() => objectDetector),
  } satisfies StaticNitroRoot;
  const { createTextRecognizer, createBarcodeScanner, createObjectDetector } =
    staticNitroRoot;
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
  const objectDetection = require('../features/object-detection') as Pick<
    StaticImageApis,
    'processImageObjectDetection'
  >;

  return {
    ...textRecognition,
    ...barcodeScanning,
    ...objectDetection,
    createTextRecognizer,
    createBarcodeScanner,
    createObjectDetector,
    recognizeTextImage,
    recognizeBarcodeImage,
    detectObjectsImage,
    disposeTextRecognizer,
    disposeBarcodeScanner,
    disposeObjectDetector,
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

  it('creates a configured object detector and detects the image URI', async () => {
    const {
      processImageObjectDetection,
      createObjectDetector,
      detectObjectsImage,
      disposeObjectDetector,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const result: ObjectDetectionResult = {
      objects: [
        {
          bounds: {
            x: 20,
            y: 10,
            centerX: 50,
            centerY: 50,
            width: 60,
            height: 80,
            top: 10,
            left: 20,
            bottom: 90,
            right: 80,
          },
          trackingId: null,
          labels: [],
        },
      ],
    };
    const options: ObjectDetectionImageOptions = {
      shouldEnableMultipleObjects: true,
      shouldEnableClassification: true,
      orientation: 'landscape-right',
      scaleFactor: 0.9,
    };
    detectObjectsImage.mockResolvedValue(result);

    const response = await processImageObjectDetection(
      'file:///tmp/shelf.jpg',
      options
    );

    expect(createObjectDetector).toHaveBeenCalledWith({
      detectorMode: 'singleImage',
      ...options,
    });
    expect(detectObjectsImage).toHaveBeenCalledWith('file:///tmp/shelf.jpg');
    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeObjectDetector).toHaveBeenCalledTimes(1);
    expect(response).toBe(result);
  });

  it('defaults the object detector to single-image mode when options are omitted', async () => {
    const {
      processImageObjectDetection,
      createObjectDetector,
      detectObjectsImage,
      disposeObjectDetector,
    } = loadStaticImageApis();
    detectObjectsImage.mockResolvedValue({ objects: [] });

    await processImageObjectDetection('file:///tmp/empty-shelf.png');

    expect(createObjectDetector).toHaveBeenCalledWith({
      detectorMode: 'singleImage',
    });
    expect(detectObjectsImage).toHaveBeenCalledWith(
      'file:///tmp/empty-shelf.png'
    );
    expect(disposeObjectDetector).toHaveBeenCalledTimes(1);
  });

  it('lets the caller override the single-image default with stream mode', async () => {
    const {
      processImageObjectDetection,
      createObjectDetector,
      detectObjectsImage,
    } = loadStaticImageApis();
    detectObjectsImage.mockResolvedValue({ objects: [] });

    await processImageObjectDetection('file:///tmp/shelf.png', {
      detectorMode: 'stream',
    });

    expect(createObjectDetector).toHaveBeenCalledWith({
      detectorMode: 'stream',
    });
  });

  it('propagates asynchronous object detector errors without falling back to the legacy bridge', async () => {
    const {
      processImageObjectDetection,
      detectObjectsImage,
      disposeObjectDetector,
      legacyNativeModuleAccess,
    } = loadStaticImageApis();
    const failure = new Error('The image could not be decoded');
    detectObjectsImage.mockRejectedValue(failure);

    await expect(
      processImageObjectDetection('file:///tmp/unreadable-shelf.jpg')
    ).rejects.toBe(failure);

    expect(legacyNativeModuleAccess).not.toHaveBeenCalled();
    expect(disposeObjectDetector).toHaveBeenCalledTimes(1);
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
