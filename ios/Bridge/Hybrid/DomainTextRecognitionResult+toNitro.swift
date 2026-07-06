extension DomainTextRecognitionResult {
  func toNitroResult() -> TextRecognitionResult {
    return TextRecognitionResult(
      text: text ?? "",
      blocks: blocks.map { $0.toNitroTextBlock() }
    )
  }
}

private extension DomainTextBlock {
  func toNitroTextBlock() -> TextBlock {
    return TextBlock(
      bounds: bounds.toNitroBoundingBox(),
      corners: corners.toNitroCorners(),
      languages: languages,
      text: text,
      lines: lines.map { $0.toNitroTextLine() }
    )
  }
}

private extension DomainTextLine {
  func toNitroTextLine() -> TextLine {
    return TextLine(
      bounds: bounds.toNitroBoundingBox(),
      corners: corners.toNitroCorners(),
      confidence: confidence.toNullableDoubleVariant(),
      angle: angle.toNullableDoubleVariant(),
      languages: languages,
      text: text,
      elements: elements.map { $0.toNitroTextElement() }
    )
  }
}

private extension DomainTextElement {
  func toNitroTextElement() -> TextElement {
    return TextElement(
      bounds: bounds.toNitroBoundingBox(),
      corners: corners.toNitroCorners(),
      confidence: confidence.toNullableDoubleVariant(),
      angle: angle.toNullableDoubleVariant(),
      languages: languages,
      text: text,
      symbols: symbols.map { $0.toNitroTextSymbol() }
    )
  }
}

private extension DomainTextSymbol {
  func toNitroTextSymbol() -> TextSymbol {
    return TextSymbol(
      bounds: bounds.toNitroBoundingBox(),
      corners: corners.toNitroCorners(),
      confidence: confidence ?? 0.0,
      angle: angle ?? 0.0,
      languages: languages,
      text: text
    )
  }
}
