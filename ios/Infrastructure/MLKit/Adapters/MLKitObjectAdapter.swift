import Foundation

#if MLKIT_OBJECT_DETECTION
  import MLKitObjectDetection

  class MLKitObjectAdapter {

    static func toDomain(_ objects: [MLKitObjectDetection.Object])
      -> DomainObjectDetectionResult
    {
      return DomainObjectDetectionResult(
        objects: objects.map { toDetectedObject($0) }
      )
    }

    private static func toDetectedObject(_ object: MLKitObjectDetection.Object)
      -> DomainDetectedObject
    {
      return DomainDetectedObject(
        bounds: toBoundingBox(object.frame),
        trackingId: object.trackingID?.doubleValue,
        labels: object.labels.map { toObjectLabel($0) }
      )
    }

    private static func toObjectLabel(_ label: MLKitObjectDetection.ObjectLabel)
      -> DomainObjectLabel
    {
      return DomainObjectLabel(
        text: label.text,
        index: Double(label.index),
        confidence: Double(label.confidence)
      )
    }

    private static func toBoundingBox(_ bounds: CGRect) -> DomainBoundingBox {
      let offsetX = (bounds.midX - ceil(bounds.width)) / 2.0
      let offsetY = (bounds.midY - ceil(bounds.height)) / 2.0

      let x = bounds.maxX + offsetX
      let y = bounds.minY + offsetY

      return DomainBoundingBox(
        x: bounds.midX + (bounds.midX - x),
        y: bounds.midY + (y - bounds.midY),
        centerX: bounds.midX,
        centerY: bounds.midY,
        width: bounds.width,
        height: bounds.height,
        top: bounds.maxY,
        left: bounds.minX,
        bottom: bounds.minY,
        right: bounds.maxX
      )
    }
  }
#endif  // MLKIT_OBJECT_DETECTION
