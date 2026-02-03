import Foundation

#if MLKIT_TEXT_RECOGNITION
  import MLKitTextRecognition

  class MLKitTextAdapter {

    static func toDomain(_ mlkitText: Text?) -> TextRecognitionResult {
      return TextRecognitionResult(
        text: mlkitText?.text,
        blocks: mlkitText?.blocks.map { toTextBlock($0) } ?? []
      )
    }

    private static func toTextBlock(_ block: MLKitTextRecognition.TextBlock)
      -> TextBlock
    {
      return TextBlock(
        text: block.text,
        bounds: toBoundingBox(block.frame),
        corners: block.cornerPoints.map { toCorner($0.cgPointValue) },
        lines: block.lines.map { toTextLine($0) },
        languages: block.recognizedLanguages.map { $0.languageCode ?? "" }
      )
    }

    private static func toTextLine(_ line: MLKitTextRecognition.TextLine)
      -> TextLine
    {
      return TextLine(
        text: line.text,
        bounds: toBoundingBox(line.frame),
        corners: line.cornerPoints.map { toCorner($0.cgPointValue) },
        elements: line.elements.map { toTextElement($0) },
        confidence: nil,
        angle: nil,
        languages: line.recognizedLanguages.map { $0.languageCode ?? "" }
      )
    }

    private static func toTextElement(_ element: MLKitTextRecognition.TextElement)
      -> TextElement
    {
      return TextElement(
        text: element.text,
        bounds: toBoundingBox(element.frame),
        corners: element.cornerPoints.map { toCorner($0.cgPointValue) },
        symbols: [],
        confidence: nil,
        angle: nil,
        languages: element.recognizedLanguages.map { $0.languageCode ?? "" }
      )
    }

    private static func toBoundingBox(_ bounds: CGRect) -> BoundingBox {
      let offsetX = (bounds.midX - ceil(bounds.width)) / 2.0
      let offsetY = (bounds.midY - ceil(bounds.height)) / 2.0

      let x = bounds.maxX + offsetX
      let y = bounds.minY + offsetY

      return BoundingBox(
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

    private static func toCorner(_ point: CGPoint) -> Corner {
      return Corner(x: Double(point.x), y: Double(point.y))
    }
  }
#endif
