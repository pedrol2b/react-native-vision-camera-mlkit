import Foundation
import NitroModules

#if MLKIT_BARCODE_SCANNING
  extension BarcodeParsedValue {
    func toAnyMap() throws -> AnyMap {
      let map = AnyMap(withPreallocatedSize: 2)
      map.setString(key: "type", value: type)
      map.setObject(key: "data", value: try data.mapValues { try toAnyValue($0) })
      return map
    }
  }

  private func toAnyValue(_ value: Any?) throws -> AnyValue {
    switch value {
    case nil, is NSNull:
      return .null
    case let value as Bool:
      return .bool(value)
    case let value as String:
      return .string(value)
    case let value as NSNumber:
      return .number(value.doubleValue)
    case let value as [Any?]:
      return .array(try value.map { try toAnyValue($0) })
    case let value as [String: Any?]:
      return .object(try value.mapValues { try toAnyValue($0) })
    default:
      throw RuntimeError.error(
        withMessage: "Barcode value contains an unsupported value: \(String(describing: value))"
      )
    }
  }
#endif
