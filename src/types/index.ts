import type { Frame } from 'react-native-vision-camera';

/**
 * Defines the bounding box and dimensions of an object.
 */
type Bounds = {
  /** The x-coordinate of the top-left corner. */
  x: number;
  /** The y-coordinate of the top-left corner. */
  y: number;
  /** The x-coordinate of the center point. */
  centerX: number;
  /** The y-coordinate of the center point. */
  centerY: number;
  /** The width of the bounding box. */
  width: number;
  /** The height of the bounding box. */
  height: number;
  /** The y-coordinate of the top edge. */
  top: number;
  /** The x-coordinate of the left edge. */
  left: number;
  /** The y-coordinate of the bottom edge. */
  bottom: number;
  /** The x-coordinate of the right edge. */
  right: number;
};

/**
 * Defines a corner point of a polygon.
 */
type Corner = {
  /** The x-coordinate of the corner. */
  x: number;
  /** The y-coordinate of the corner. */
  y: number;
};

/**
 * Options for configuring plugins.
 */
type CommonPluginOptions = {
  /**
   * Specifies whether to invert the colors of the input image before processing.
   *
   * When set to true, the colors of the input image are inverted before the processing. This can potentially improve the success rate of processing, especially in cases where the color of the object and background have low contrast.
   *
   * The color inversion is achieved by creating a new Bitmap with the same dimensions as the input Bitmap, and then drawing the input Bitmap onto the new Bitmap using a Paint object with a color filter that inverts colors. The color inversion is achieved by setting a negative scale of -1 for the red, green, and blue color channels, and then shifting them by 255 (which is the maximum value for an 8-bit color channel).
   *
   * Defaults to `false`.
   *
   * @example
   * ```
   * { invertColors: true }
   * ```
   */
  invertColors?: boolean;
};

/**
 * Options for configuring the image labeling plugin.
 */
export type ImageLabelerPluginOptions = CommonPluginOptions & {
  /**
   * Specifies the confidence threshold for the label recognizer.
   *
   * The confidence threshold is a value between 0 and 100 that determines the minimum confidence score required for a label to be recognized.
   *
   * Defaults to `{ confidenceThreshold: 50 }`.
   *
   * @example
   * ```
   *  { confidenceThreshold: 70 }
   * ```
   */
  confidenceThreshold?: number;
};

/**
 * Plugin for labeling objects in a frame.
 */
export type ImageLabelerPlugin = {
  /**
   * Labels objects in a given frame.
   *
   * @param frame - The frame processor {@link Frame}.
   * @returns An array containing the labeled {@link Label} data.
   *
   * @example
   * ```ts
   * const frameProcessor = useFrameProcessor((frame) => {
   *   'worklet';
   *   const labels = imageLabeler(frame);
   *   console.log(labels);
   * }, []);
   * ```
   */
  imageLabeler: (frame: Frame) => Label[];
};

/**
 * Represents a recognized label.
 */
export type Label = {
  /** The recognized label. */
  text: string;
  /** The confidence score of the recognized label. */
  confidence: number;
  /** The index of the label. */
  index: number;
};

/**
 * Supported barcode formats.
 */
type BarcodeFormat =
  | 'ALL'
  | 'CODE_128'
  | 'CODE_39'
  | 'CODE_93'
  | 'CODABAR'
  | 'DATA_MATRIX'
  | 'EAN_13'
  | 'EAN_8'
  | 'ITF'
  | 'QR_CODE'
  | 'UPC_A'
  | 'UPC_E'
  | 'PDF417'
  | 'AZTEC';

/**
 * Options for configuring the barcode plugin.
 */
export type BarcodeScannerPluginOptions = CommonPluginOptions & {
  /**
   * Specifies the barcode formats to be recognized.
   *
   * Defaults to `{ formats: ['ALL'] }`.
   *
   * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.BarcodeFormat
   *
   * @example
   * ```
   *  { formats: ['QR_CODE'] }
   * ```
   */
  formats?: BarcodeFormat[];
  /**
   * Specifies whether to enable all potential barcode formats.
   *
   * When enabled, the scanner will return all potential barcodes even if they cannot be decoded. This can be useful for further detection, for example by zooming in the camera to get a clearer image of any barcode in the returned bounding box.
   *
   * Note: This feature is available starting from bundled model 17.1.0 and unbundled model 18.2.0.
   *
   * Defaults to `false`.
   *
   * @example
   * ```
   * { enableAllPotentialBarcodes: true }
   * ```
   */
  enableAllPotentialBarcodes?: boolean;
};

/**
 * Plugin for scanning barcodes from a frame.
 */
export type BarcodeScannerPlugin = {
  /**
   * Scans barcodes from a given frame.
   *
   * @param frame - The frame processor {@link Frame}.
   * @returns An array containing the scanned {@link Barcode} data.
   *
   * @example
   * ```ts
   * const frameProcessor = useFrameProcessor((frame) => {
   *   'worklet';
   *   const barcodes = barcodeScanner(frame);
   *   console.log(barcodes);
   * }, []);
   * ```
   */
  barcodeScanner: (frame: Frame) => Barcode[];
};

/**
 * Represents a detected barcode.
 */
export type Barcode = {
  /** The bounding box of the barcode. */
  bounds: Bounds;
  /** The corner points of the barcode. */
  corners: Corner[];
  /** The raw value of the barcode. */
  rawValue: string;
  /** The display value of the barcode. */
  displayValue: string;
  /** The format of the barcode. */
  format: string;
  /** The value type of the barcode. */
  valueType: string;
};

/**
 * Supported text recognition languages.
 */
type TextLanguage = 'LATIN' | 'CHINESE' | 'DEVANAGARI' | 'JAPANESE' | 'KOREAN';

/**
 * Options for configuring the text recognition plugin.
 */
export type TextRecognizerPluginOptions = CommonPluginOptions & {
  /**
   * Specifies the language for the text recognizer.
   *
   * Defaults to `{ language: 'LATIN' }`.
   *
   * @example
   * ```
   *  { language: 'LATIN' }
   * ```
   */
  language?: TextLanguage;
};

/**
 * Plugin for scanning text from a frame.
 */
export type TextRecognizerPlugin = {
  /**
   * Scans texts from a given frame.
   *
   * @param frame - The frame processor {@link Frame}.
   * @returns A hashmap with the scanned {@link Text} data.
   *
   * @example
   * ```ts
   * const frameProcessor = useFrameProcessor((frame) => {
   *   'worklet';
   *   const text = textRecognizer(frame);
   *   console.log(text);
   * }, []);
   * ```
   */
  textRecognizer: (frame: Frame) => Text;
};

/**
 * Represents a symbol in recognized text.
 */
type TextSymbol = {
  /** The bounding box of the symbol. */
  bounds: Bounds;
  /** The corner points of the symbol. */
  corners: Corner[];
  /** The confidence score of the recognized symbol. */
  confidence: number;
  /** The angle of the symbol. */
  angle: number;
  /** The language of the symbol. */
  language: string;
  /** The recognized text of the symbol. */
  text: string;
};

/**
 * Represents an element in recognized text.
 */
type TextElement = {
  /** The bounding box of the element. */
  bounds: Bounds;
  /** The corner points of the element. */
  corners: Corner[];
  /** The confidence score of the recognized element. */
  confidence: number;
  /** The angle of the element. */
  angle: number;
  /** The language of the element. */
  language: string;
  /** The recognized text of the element. */
  text: string;
  /** The symbols that make up the element. */
  symbols: TextSymbol[];
};

/**
 * Represents a line in recognized text.
 */
type TextLine = {
  /** The bounding box of the line. */
  bounds: Bounds;
  /** The corner points of the line. */
  corners: Corner[];
  /** The confidence score of the recognized line. */
  confidence: number;
  /** The angle of the line. */
  angle: number;
  /** The language of the line. */
  language: string;
  /** The recognized text of the line. */
  text: string;
  /** The elements that make up the line. */
  elements: TextElement[];
};

/**
 * Represents a block in recognized text.
 */
type TextBlock = {
  /** The bounding box of the block. */
  bounds: Bounds;
  /** The corner points of the block. */
  corners: Corner[];
  /** The language of the block. */
  language: string;
  /** The recognized text of the block. */
  text: string;
  /** The lines that make up the block. */
  lines: TextLine[];
};

/**
 * Represents the recognized text in a frame.
 */
export type Text = {
  /** The full recognized text. */
  text: string;
  /** The blocks that make up the recognized text. */
  blocks: TextBlock[];
};

/**
 * Options for configuring the object detection plugin.
 */
export type ObjectDetectorPluginOptions = CommonPluginOptions & {
  /**
   * Specifies whether to enable multiple objects.
   *
   * When set to true, the plugin will enable multiple objects to be detected in a single frame. This can be useful when detecting multiple objects in a single frame.
   *
   * Defaults to `false`.
   *
   * @example
   * ```
   * { enableMultipleObjects: true }
   * ```
   */
  enableMultipleObjects?: boolean;
  /**
   * Specifies whether to enable classification.
   *
   * When set to true, the plugin will enable classification of detected objects. This can be useful when classifying detected objects.
   *
   * Defaults to `false`.
   *
   * @example
   * ```
   * { enableClassification: true }
   * ```
   */
  enableClassification?: boolean;
};

/**
 * Plugin for detecting objects in a frame.
 */
export type ObjectDetectorPlugin = {
  /**
   * Detect objects in a given frame.
   *
   * @param frame - The frame processor {@link Frame}.
   * @returns An array containing the detected object {@link Object} data.
   *
   * @example
   * ```ts
   * const frameProcessor = useFrameProcessor((frame) => {
   *   'worklet';
   *   const objects = objectDetector(frame);
   *   console.log(objects);
   * }, []);
   * ```
   */
  objectDetector: (frame: Frame) => Object[];
};

/**
 * Represents a detected object.
 */
export type Object = {
  /** The bounding box of the detected object. */
  bounds: Bounds;
  /** The labels of the detected object */
  labels: Label[];
  /** The tracking ID of the detected object. */
  trackingId: number;
};
