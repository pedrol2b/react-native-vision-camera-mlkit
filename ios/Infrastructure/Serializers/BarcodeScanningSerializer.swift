import Foundation

class BarcodeScanningSerializer {

  static func toReactNativeMap(_ result: BarcodeScanningResult) -> [String: Any] {
    var map = [String: Any]()
    map["barcodes"] = toBarcodesArray(result.barcodes)
    return map
  }

  private static func toBarcodesArray(_ barcodes: [BarcodeResult]) -> [[String: Any]] {
    return barcodes.map { toBarcodeMap($0) }
  }

  private static func toBarcodeMap(_ barcode: BarcodeResult) -> [String: Any] {
    var map = [String: Any]()
    if let bounds = barcode.bounds {
      map["bounds"] = toBoundsMap(bounds)
    }
    if let corners = barcode.corners {
      map["corners"] = toCornersArray(corners)
    }
    map["rawValue"] = barcode.rawValue
    map["displayValue"] = barcode.displayValue
    map["format"] = barcode.format.rawValue
    map["valueType"] = barcode.valueType.rawValue
    if let content = barcode.content {
      map["content"] = content
    }
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
