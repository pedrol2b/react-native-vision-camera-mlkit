extension DomainObjectDetectionResult {
  func toNitroResult() -> ObjectDetectionResult {
    return ObjectDetectionResult(
      objects: objects.map { $0.toNitroDetectedObject() }
    )
  }
}

private extension DomainDetectedObject {
  func toNitroDetectedObject() -> DetectedObject {
    return DetectedObject(
      bounds: bounds.toNitroBoundingBox(),
      trackingId: trackingId.toNullableDoubleVariant(),
      labels: labels.map { $0.toNitroObjectLabel() }
    )
  }
}

private extension DomainObjectLabel {
  func toNitroObjectLabel() -> ObjectLabel {
    return ObjectLabel(
      text: text,
      index: index,
      confidence: confidence
    )
  }
}
