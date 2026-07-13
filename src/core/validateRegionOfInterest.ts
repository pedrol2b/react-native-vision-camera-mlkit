import type { RegionOfInterest } from './types';

/**
 * Validates a {@link RegionOfInterest} before it crosses into native code.
 * Fails fast on out-of-bounds values instead of letting native preprocessing
 * fail deep inside the crop step.
 * @throws {Error} If the region is invalid for its unit.
 */
export const validateRegionOfInterest = (roi: RegionOfInterest): void => {
  const { x, y, width, height, unit = 'normalized' } = roi;

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

  if (unit === 'normalized' && (x + width > 1 || y + height > 1)) {
    throw new Error(
      `Invalid RegionOfInterest: normalized x + width and y + height must be <= 1 (got x=${x}, width=${width}, y=${y}, height=${height}).`
    );
  }
};
