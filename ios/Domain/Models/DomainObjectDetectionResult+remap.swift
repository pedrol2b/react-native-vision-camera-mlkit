import Foundation

#if canImport(MLKitVision)
  import MLKitVision

  extension DomainObjectDetectionResult {
    /// Remaps every bounding box in the result back onto full-source-image coordinates, undoing
    /// the ROI crop offset and preprocessing scale. No-op when neither a crop nor a scale was
    /// applied (offset is zero and scale is 1.0).
    func remapped(using metadata: ImageMetadata) -> DomainObjectDetectionResult {
      return DomainObjectDetectionResult(
        objects: objects.map { $0.remapped(using: metadata) }
      )
    }
  }

  extension DomainDetectedObject {
    fileprivate func remapped(using metadata: ImageMetadata) -> DomainDetectedObject {
      return DomainDetectedObject(
        bounds: bounds?.remapped(using: metadata),
        trackingId: trackingId,
        labels: labels
      )
    }
  }
#endif
