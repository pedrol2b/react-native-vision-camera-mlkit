import Foundation

#if canImport(MLKitVision)
  import MLKitVision

  extension DomainTextRecognitionResult {
    /// Remaps every bounding box and corner point in the result tree back onto full-source-image
    /// coordinates, undoing the ROI crop offset and preprocessing scale. No-op when neither a
    /// crop nor a scale was applied (offset is zero and scale is 1.0).
    func remapped(using metadata: ImageMetadata) -> DomainTextRecognitionResult {
      return DomainTextRecognitionResult(
        text: text,
        blocks: blocks.map { $0.remapped(using: metadata) }
      )
    }
  }

  extension DomainTextBlock {
    fileprivate func remapped(using metadata: ImageMetadata) -> DomainTextBlock {
      return DomainTextBlock(
        text: text,
        bounds: bounds?.remapped(using: metadata),
        corners: corners?.map { $0.remapped(using: metadata) },
        lines: lines.map { $0.remapped(using: metadata) },
        languages: languages
      )
    }
  }

  extension DomainTextLine {
    fileprivate func remapped(using metadata: ImageMetadata) -> DomainTextLine {
      return DomainTextLine(
        text: text,
        bounds: bounds?.remapped(using: metadata),
        corners: corners?.map { $0.remapped(using: metadata) },
        elements: elements.map { $0.remapped(using: metadata) },
        confidence: confidence,
        angle: angle,
        languages: languages
      )
    }
  }

  extension DomainTextElement {
    fileprivate func remapped(using metadata: ImageMetadata) -> DomainTextElement {
      return DomainTextElement(
        text: text,
        bounds: bounds?.remapped(using: metadata),
        corners: corners?.map { $0.remapped(using: metadata) },
        symbols: symbols.map { $0.remapped(using: metadata) },
        confidence: confidence,
        angle: angle,
        languages: languages
      )
    }
  }

  extension DomainTextSymbol {
    fileprivate func remapped(using metadata: ImageMetadata) -> DomainTextSymbol {
      return DomainTextSymbol(
        text: text,
        bounds: bounds?.remapped(using: metadata),
        corners: corners?.map { $0.remapped(using: metadata) },
        confidence: confidence,
        angle: angle,
        languages: languages
      )
    }
  }
#endif
