import Foundation

struct DomainTextRecognitionResult {
  let text: String?
  let blocks: [DomainTextBlock]
}

struct DomainTextBlock {
  let text: String
  let bounds: DomainBoundingBox?
  let corners: [DomainCorner]?
  let lines: [DomainTextLine]
  let languages: [String]
}

struct DomainTextLine {
  let text: String
  let bounds: DomainBoundingBox?
  let corners: [DomainCorner]?
  let elements: [DomainTextElement]
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}

struct DomainTextElement {
  let text: String
  let bounds: DomainBoundingBox?
  let corners: [DomainCorner]?
  let symbols: [DomainTextSymbol]
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}

struct DomainTextSymbol {
  let text: String
  let bounds: DomainBoundingBox?
  let corners: [DomainCorner]?
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}
