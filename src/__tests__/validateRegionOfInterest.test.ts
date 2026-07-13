import { validateRegionOfInterest } from '../core/validateRegionOfInterest';
import type { RegionOfInterest } from '../core/types';

describe('validateRegionOfInterest', () => {
  it('accepts a valid normalized region', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 })
    ).not.toThrow();
  });

  it('accepts a valid normalized region with unit explicitly set', () => {
    expect(() =>
      validateRegionOfInterest({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        unit: 'normalized',
      })
    ).not.toThrow();
  });

  it('accepts a valid pixel region regardless of magnitude', () => {
    expect(() =>
      validateRegionOfInterest({
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        unit: 'pixel',
      })
    ).not.toThrow();
  });

  it('throws when x is negative', () => {
    expect(() =>
      validateRegionOfInterest({ x: -0.1, y: 0, width: 0.5, height: 0.5 })
    ).toThrow(/x and y must be >= 0/);
  });

  it('throws when y is negative', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0, y: -0.1, width: 0.5, height: 0.5 })
    ).toThrow(/x and y must be >= 0/);
  });

  it('throws when width is zero or negative', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0, y: 0, width: 0, height: 0.5 })
    ).toThrow(/width and height must be > 0/);
  });

  it('throws when height is zero or negative', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0, y: 0, width: 0.5, height: -1 })
    ).toThrow(/width and height must be > 0/);
  });

  it('throws when normalized x + width exceeds 1', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0.6, y: 0, width: 0.5, height: 0.5 })
    ).toThrow(/x \+ width and y \+ height must be <= 1/);
  });

  it('throws when normalized y + height exceeds 1', () => {
    expect(() =>
      validateRegionOfInterest({ x: 0, y: 0.6, width: 0.5, height: 0.5 })
    ).toThrow(/x \+ width and y \+ height must be <= 1/);
  });

  it('does not apply the normalized bounds check for pixel regions', () => {
    const roi: RegionOfInterest = {
      x: 500,
      y: 500,
      width: 500,
      height: 500,
      unit: 'pixel',
    };

    expect(() => validateRegionOfInterest(roi)).not.toThrow();
  });
});
