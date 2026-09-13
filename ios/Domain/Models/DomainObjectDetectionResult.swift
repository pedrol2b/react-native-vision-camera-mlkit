import Foundation

struct DomainObjectDetectionResult {
  let objects: [DomainDetectedObject]
}

struct DomainDetectedObject {
  let bounds: DomainBoundingBox?
  let trackingId: Double?
  let labels: [DomainObjectLabel]
}

struct DomainObjectLabel {
  let text: String
  let index: Double
  let confidence: Double
}
