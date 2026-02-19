import Foundation

class TextRecognitionSerializer {

  static func toReactNativeMap(_ result: TextRecognitionResult) -> [String: Any] {
    var map = [String: Any]()
    map["text"] = result.text
    map["blocks"] = toBlocksArray(result.blocks)
    return map
  }

  private static func toBlocksArray(_ blocks: [TextBlock]) -> [[String: Any]] {
    return blocks.map { toBlockMap($0) }
  }

  private static func toBlockMap(_ block: TextBlock) -> [String: Any] {
    var map = [String: Any]()
    map["text"] = block.text
    if let bounds = block.bounds {
      map["bounds"] = toBoundsMap(bounds)
    }
    if let corners = block.corners {
      map["corners"] = toCornersArray(corners)
    }
    map["lines"] = toLinesArray(block.lines)
    map["languages"] = block.languages
    return map
  }

  private static func toLinesArray(_ lines: [TextLine]) -> [[String: Any]] {
    return lines.map { toLineMap($0) }
  }

  private static func toLineMap(_ line: TextLine) -> [String: Any] {
    var map = [String: Any]()
    map["text"] = line.text
    if let bounds = line.bounds {
      map["bounds"] = toBoundsMap(bounds)
    }
    if let corners = line.corners {
      map["corners"] = toCornersArray(corners)
    }
    map["elements"] = toElementsArray(line.elements)
    map["confidence"] = line.confidence
    map["angle"] = line.angle
    map["languages"] = line.languages
    return map
  }

  private static func toElementsArray(_ elements: [TextElement]) -> [[String:
    Any]]
  {
    return elements.map { toElementMap($0) }
  }

  private static func toElementMap(_ element: TextElement) -> [String: Any] {
    var map = [String: Any]()
    map["text"] = element.text
    if let bounds = element.bounds {
      map["bounds"] = toBoundsMap(bounds)
    }
    if let corners = element.corners {
      map["corners"] = toCornersArray(corners)
    }
    map["symbols"] = element.symbols.map { toSymbolMap($0) }
    map["confidence"] = element.confidence
    map["angle"] = element.angle
    map["languages"] = element.languages
    return map
  }

  private static func toSymbolMap(_ symbol: TextSymbol) -> [String: Any] {
    var map = [String: Any]()
    map["text"] = symbol.text
    if let bounds = symbol.bounds {
      map["bounds"] = toBoundsMap(bounds)
    }
    if let corners = symbol.corners {
      map["corners"] = toCornersArray(corners)
    }
    map["confidence"] = symbol.confidence
    map["angle"] = symbol.angle
    map["languages"] = symbol.languages
    return map
  }

  private static func toBoundsMap(_ bounds: BoundingBox) -> [String: Double] {
    return [
      "x": bounds.x,
      "y": bounds.y,
      "centerX": bounds.centerX,
      "centerY": bounds.centerY,
      "width": bounds.width,
      "height": bounds.height,
      "top": bounds.top,
      "left": bounds.left,
      "bottom": bounds.bottom,
      "right": bounds.right,
    ]
  }

  private static func toCornersArray(_ corners: [Corner]) -> [[String: Double]] {
    return corners.map { toCornerMap($0) }
  }

  private static func toCornerMap(_ corner: Corner) -> [String: Double] {
    return [
      "x": corner.x,
      "y": corner.y,
    ]
  }
}
