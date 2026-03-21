import Foundation

#if MLKIT_BARCODE_SCANNING
  enum BarcodeScanningOptionParser {
    static func parseFormats(_ value: Any?) -> [BarcodeFormatOption] {
      guard let items = value as? [Any] else {
        return []
      }
      return
        items
        .compactMap { $0 as? String }
        .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        .compactMap { BarcodeFormatOption(rawValue: $0) }
    }

    static func parseEnableAllPotentialBarcodes(_ value: Any?) -> Bool {
      return value as? Bool ?? false
    }

  }
#endif  // MLKIT_BARCODE_SCANNING
