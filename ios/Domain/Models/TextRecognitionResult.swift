import Foundation

struct TextRecognitionResult {
  let text: String?
  let blocks: [TextBlock]
}

struct TextBlock {
  let text: String
  let bounds: BoundingBox?
  let corners: [Corner]?
  let lines: [TextLine]
  let languages: [String]
}

struct TextLine {
  let text: String
  let bounds: BoundingBox?
  let corners: [Corner]?
  let elements: [TextElement]
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}

struct TextElement {
  let text: String
  let bounds: BoundingBox?
  let corners: [Corner]?
  let symbols: [TextSymbol]
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}

struct TextSymbol {
  let text: String
  let bounds: BoundingBox?
  let corners: [Corner]?
  let confidence: Double?
  let angle: Double?
  let languages: [String]
}
