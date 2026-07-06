private let emptyNitroBoundingBox = BoundingBox(
  x: 0.0,
  y: 0.0,
  centerX: 0.0,
  centerY: 0.0,
  width: 0.0,
  height: 0.0,
  top: 0.0,
  left: 0.0,
  bottom: 0.0,
  right: 0.0
)

extension Optional where Wrapped == DomainBoundingBox {
  func toNitroBoundingBox() -> BoundingBox {
    guard let bounds = self else {
      return emptyNitroBoundingBox
    }

    return bounds.toNitroBoundingBox()
  }
}

extension DomainBoundingBox {
  func toNitroBoundingBox() -> BoundingBox {
    return BoundingBox(
      x: x,
      y: y,
      centerX: centerX,
      centerY: centerY,
      width: width,
      height: height,
      top: top,
      left: left,
      bottom: bottom,
      right: right
    )
  }
}
