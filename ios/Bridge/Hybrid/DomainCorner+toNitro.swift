extension DomainCorner {
  func toNitroCorner() -> Corner {
    return Corner(x: x, y: y)
  }
}

extension Optional where Wrapped == [DomainCorner] {
  func toNitroCorners() -> [Corner] {
    return self?.map { $0.toNitroCorner() } ?? []
  }
}
