import Foundation

enum DomainRegionOfInterestUnit {
  case normalized
  case pixel
}

/// Domain-layer Region of Interest, distinct from the Nitro-bridge `RegionOfInterest`
/// (see `RegionOfInterest+toDomain.swift` for the conversion), matching how `DomainOrientation`
/// is kept separate from the Nitro `Orientation` type.
struct DomainRegionOfInterest {
  let x: CGFloat
  let y: CGFloat
  let width: CGFloat
  let height: CGFloat
  let unit: DomainRegionOfInterestUnit

  init(
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    height: CGFloat,
    unit: DomainRegionOfInterestUnit = .normalized
  ) {
    self.x = x
    self.y = y
    self.width = width
    self.height = height
    self.unit = unit
  }
}

enum RegionOfInterestValidationError: Error, LocalizedError {
  case negativeOrigin(x: CGFloat, y: CGFloat)
  case nonPositiveSize(width: CGFloat, height: CGFloat)
  case normalizedOutOfBounds(x: CGFloat, width: CGFloat, y: CGFloat, height: CGFloat)

  var errorDescription: String? {
    switch self {
    case .negativeOrigin(let x, let y):
      return "Invalid RegionOfInterest: x and y must be >= 0 (got x=\(x), y=\(y))."
    case .nonPositiveSize(let width, let height):
      return
        "Invalid RegionOfInterest: width and height must be > 0 (got width=\(width), height=\(height))."
    case .normalizedOutOfBounds(let x, let width, let y, let height):
      return
        "Invalid RegionOfInterest: normalized x + width and y + height must be <= 1 (got x=\(x), width=\(width), y=\(y), height=\(height))."
    }
  }
}

extension DomainRegionOfInterest {
  /// Mirrors the JS-side `validateRegionOfInterest` rules so native preprocessing fails fast
  /// instead of producing a nonsensical crop deep inside the pipeline.
  func validate() throws {
    if x < 0 || y < 0 {
      throw RegionOfInterestValidationError.negativeOrigin(x: x, y: y)
    }

    if width <= 0 || height <= 0 {
      throw RegionOfInterestValidationError.nonPositiveSize(width: width, height: height)
    }

    if unit == .normalized && (x + width > 1 || y + height > 1) {
      throw RegionOfInterestValidationError.normalizedOutOfBounds(
        x: x, width: width, y: y, height: height
      )
    }
  }

  /// Resolves this region into a pixel rectangle clamped to the given image dimensions.
  /// `imageWidth`/`imageHeight` must be in the same pixel space the crop will be applied to
  /// (post-orientation-normalization, pre-scale).
  func resolvedPixelRect(imageWidth: CGFloat, imageHeight: CGFloat) -> CGRect {
    let (px, py, pw, ph): (CGFloat, CGFloat, CGFloat, CGFloat)
    switch unit {
    case .pixel:
      (px, py, pw, ph) = (x, y, width, height)
    case .normalized:
      (px, py, pw, ph) = (x * imageWidth, y * imageHeight, width * imageWidth, height * imageHeight)
    }

    let left = max(0, min(px, imageWidth))
    let top = max(0, min(py, imageHeight))
    let right = max(left, min(px + pw, imageWidth))
    let bottom = max(top, min(py + ph, imageHeight))
    return CGRect(x: left, y: top, width: right - left, height: bottom - top)
  }
}
