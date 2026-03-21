import Foundation

#if MLKIT_BARCODE_SCANNING
  class BarcodeScanningSerializer {

    static func toReactNativeMap(_ result: BarcodeScanningResult) -> [String: Any] {
      var map = [String: Any]()
      map["barcodes"] = result.barcodes.map { toBarcodeMap($0) }
      return map
    }

    private static func toBarcodeMap(_ barcode: BarcodeData) -> [String: Any] {
      var map = [String: Any]()
      if let bounds = barcode.bounds {
        map["bounds"] = toBoundsMap(bounds)
      }
      if let corners = barcode.corners {
        map["corners"] = corners.map { toCornerMap($0) }
      }
      map["format"] = barcode.format
      map["formatName"] = barcode.formatName
      map["valueType"] = barcode.valueType
      map["valueTypeName"] = barcode.valueTypeName
      map["rawValue"] = barcode.rawValue as Any
      map["displayValue"] = barcode.displayValue as Any
      map["rawBytes"] = barcode.rawBytes as Any
      map["isPotential"] = barcode.isPotential
      if let value = barcode.value {
        map["value"] = toValueMap(value)
      }
      return map
    }

    private static func toValueMap(_ value: BarcodeParsedValue) -> [String: Any] {
      var map = [String: Any]()
      map["type"] = value.type
      map["data"] = toNonOptionalDictionary(value.data)
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

    private static func toCornerMap(_ corner: Corner) -> [String: Double] {
      return [
        "x": corner.x,
        "y": corner.y,
      ]
    }

    private static func toNonOptionalDictionary(_ dictionary: [String: Any?])
      -> [String: Any]
    {
      var output: [String: Any] = [:]
      for (key, value) in dictionary {
        output[key] = normalize(value)
      }
      return output
    }

    private static func normalize(_ value: Any?) -> Any {
      guard let value = value else {
        return NSNull()
      }

      if let dictionary = value as? [String: Any?] {
        return toNonOptionalDictionary(dictionary)
      }

      if let array = value as? [Any?] {
        return array.map { normalize($0) }
      }

      return value
    }
  }
#endif  // MLKIT_BARCODE_SCANNING
