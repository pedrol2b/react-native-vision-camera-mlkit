import { MLKIT_FEATURE_KEYS } from './constants';

export type MLKitFeature =
  (typeof MLKIT_FEATURE_KEYS)[keyof typeof MLKIT_FEATURE_KEYS];

export type BoundingBox = {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export type Corner = {
  x: number;
  y: number;
};

/**
 * Whether a {@link RegionOfInterest}'s `x`/`y`/`width`/`height` are
 * normalized to the `0..1` range (relative to the source frame/image) or
 * absolute pixel values.
 */
export type RegionOfInterestUnit = 'normalized' | 'pixel';

/**
 * Restricts ML Kit processing to a rectangular region of the source
 * frame/image. Cropping happens before recognition to reduce CPU/GPU work;
 * result coordinates (bounding boxes, corners) are always mapped back to
 * full source coordinates, so overlays don't need to know a crop happened.
 */
export type RegionOfInterest = {
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * @default 'normalized'
   */
  unit?: RegionOfInterestUnit;
};

export type MLKitBaseOptions = {
  /**
   * Optional image downscaling for performance optimization.
   * Clamped to the range [0.9, 1.0] to preserve ML accuracy.
   * Example: 0.9 reduces width/height by ~10% (~19% fewer pixels).
   * @default 1.0
   */
  scaleFactor?: number;
  /**
   * Invert colors before processing. May improve recognition for low-contrast content.
   * @default false
   */
  invertColors?: boolean;
  /**
   * Crop processing to a rectangular region of the frame before running
   * ML Kit, to reduce CPU/GPU work. Result coordinates are mapped back to
   * full source coordinates.
   */
  roi?: RegionOfInterest;
  /**
   * @deprecated Throttle frames manually inside your `useFrameOutput` `onFrame` callback instead.
   * Process one frame, then skip the next N frames before processing again.
   * For example, `frameProcessInterval: 2` means: process frame 1, skip frames 2-3, process frame 4, etc.
   * @example
   * ```ts
   * const frameOutput = useFrameOutput({
   *   onFrame(frame) {
   *     'worklet'
   *     if (frameCount.value++ % 10 !== 0) {
   *       frame.dispose()
   *       return
   *     }
   *     const result = textRecognition(frame)
   *   },
   * })
   * ```
   * @default 0 (process every frame)
   */
  frameProcessInterval?: number;
};

/**
 * Represents Orientation. Depending on the context, this might be a sensor
 * orientation (relative to the phone's orentation), or view orientation.
 *
 * - `portrait`: **0°** (home-button at the bottom)
 * - `landscape-left`: **90°** (home-button on the left)
 * - `portrait-upside-down`: **180°** (home-button at the top)
 * - `landscape-right`: **270°** (home-button on the right)
 */
export type Orientation =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape-left'
  | 'landscape-right';

export type MLKitBaseArguments = {
  /**
   * The output orientation of the camera. Pass this to support rotation in text recognition.
   * @platform iOS Only required on iOS; Android handles rotation automatically.
   */
  outputOrientation?: Orientation;
};

export type ImageProcessingBaseOptions = {
  /**
   * Override the image orientation for processing.
   * When omitted, the orientation is automatically detected from the image's
   * EXIF metadata. Provide an explicit value only if the metadata is missing
   * or incorrect.
   */
  orientation?: Orientation;
  /**
   * Invert colors before processing. May improve recognition for low-contrast content.
   * @default false
   */
  invertColors?: boolean;
  /**
   * Crop processing to a rectangular region of the image before running
   * ML Kit, to reduce CPU/GPU work. Result coordinates are mapped back to
   * full source coordinates.
   */
  roi?: RegionOfInterest;
};

export type ImageProcessingError =
  | 'IMAGE_NOT_FOUND_ERROR'
  | 'INVALID_URI_ERROR'
  | 'IMAGE_PROCESSING_FAILED_ERROR'
  | 'UNSUPPORTED_IMAGE_FORMAT_ERROR';
