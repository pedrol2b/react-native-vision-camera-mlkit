extension ObjectDetectorMode {
  func toDomainDetectorMode() -> DomainObjectDetectorMode {
    switch self {
    case .stream: return .stream
    case .singleimage: return .singleImage
    }
  }
}
