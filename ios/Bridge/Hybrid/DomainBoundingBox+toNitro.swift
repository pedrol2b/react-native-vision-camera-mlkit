private let emptyNitroBoundingBox = BoundingBox(
  x: 0.0,
  y: 0.0,
  width: 0.0,
  height: 0.0
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
      width: width,
      height: height
    )
  }
}
