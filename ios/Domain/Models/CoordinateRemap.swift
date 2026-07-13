import Foundation

#if canImport(MLKitVision)
  import MLKitVision

  /// Shared primitive for mapping a processed-image coordinate (post-crop, post-scale) back onto
  /// full-source-image coordinates: translate by the crop offset, then unscale.
  /// `sourceX = offsetX + processedX / scaleFactor`.
  /// Domain result coordinates are `Double` (matching `DomainBoundingBox`/`DomainCorner`), while
  /// `ImageMetadata`'s offset/scale are `CGFloat`; both convert freely since neither loses
  /// precision on 64-bit Apple platforms.
  func remapPoint(x: Double, y: Double, metadata: ImageMetadata) -> (x: Double, y: Double) {
    let scale = metadata.scaleFactor == 0 ? 1.0 : Double(metadata.scaleFactor)
    return (
      x: Double(metadata.offsetX) + x / scale,
      y: Double(metadata.offsetY) + y / scale
    )
  }

  extension DomainBoundingBox {
    /// Remaps every coordinate field onto full-source-image coordinates using the given
    /// preprocessing metadata. `width`/`height` only unscale (no translation), matching every
    /// other field which translates by the crop offset then unscales.
    func remapped(using metadata: ImageMetadata) -> DomainBoundingBox {
      let scale = metadata.scaleFactor == 0 ? 1.0 : Double(metadata.scaleFactor)
      let origin = remapPoint(x: x, y: y, metadata: metadata)
      let center = remapPoint(x: centerX, y: centerY, metadata: metadata)
      let topLeft = remapPoint(x: left, y: top, metadata: metadata)
      let bottomRight = remapPoint(x: right, y: bottom, metadata: metadata)

      return DomainBoundingBox(
        x: origin.x,
        y: origin.y,
        centerX: center.x,
        centerY: center.y,
        width: width / scale,
        height: height / scale,
        top: topLeft.y,
        left: topLeft.x,
        bottom: bottomRight.y,
        right: bottomRight.x
      )
    }
  }

  extension DomainCorner {
    func remapped(using metadata: ImageMetadata) -> DomainCorner {
      let point = remapPoint(x: x, y: y, metadata: metadata)
      return DomainCorner(x: point.x, y: point.y)
    }
  }
#endif
