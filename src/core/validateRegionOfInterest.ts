const hasOwnProperty = (value: object, property: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, property);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

type RegionOfInterestDimensions = Record<string, unknown> & {
  x: number;
  y: number;
  width: number;
  height: number;
};

const hasOwnFiniteDimensions = (
  roi: Record<string, unknown>
): roi is RegionOfInterestDimensions =>
  ['x', 'y', 'width', 'height'].every(
    (property) =>
      hasOwnProperty(roi, property) &&
      typeof roi[property] === 'number' &&
      Number.isFinite(roi[property])
  );

/**
 * Validates a {@link RegionOfInterest} before it crosses into native code.
 * Fails fast on out-of-bounds values instead of letting native preprocessing
 * fail deep inside the crop step.
 * @throws {Error} If the region is invalid for its unit.
 */
export const validateRegionOfInterest = (roi: unknown): void => {
  if (!isPlainObject(roi)) {
    throw new Error('Invalid RegionOfInterest: expected a plain object.');
  }

  if (!hasOwnFiniteDimensions(roi)) {
    throw new Error(
      'Invalid RegionOfInterest: x, y, width, and height must be own finite numbers.'
    );
  }

  const unit = hasOwnProperty(roi, 'unit') ? roi.unit : undefined;
  if (unit !== undefined && unit !== 'normalized' && unit !== 'pixel') {
    throw new Error(
      'Invalid RegionOfInterest: unit must be "normalized" or "pixel" when provided.'
    );
  }

  const { x, y, width, height } = roi;

  if (x < 0 || y < 0) {
    throw new Error(
      `Invalid RegionOfInterest: x and y must be >= 0 (got x=${x}, y=${y}).`
    );
  }

  if (width <= 0 || height <= 0) {
    throw new Error(
      `Invalid RegionOfInterest: width and height must be > 0 (got width=${width}, height=${height}).`
    );
  }

  if (
    (unit === undefined || unit === 'normalized') &&
    (x + width > 1 || y + height > 1)
  ) {
    throw new Error(
      `Invalid RegionOfInterest: normalized x + width and y + height must be <= 1 (got x=${x}, width=${width}, y=${y}, height=${height}).`
    );
  }
};
