import Foundation

#if MLKIT_BARCODE_SCANNING
  struct BarcodeScanningResult {
    let barcodes: [BarcodeData]
  }

  struct BarcodeData {
    let bounds: BoundingBox?
    let corners: [Corner]?
    let format: Int
    let formatName: String
    let valueType: Int
    let valueTypeName: String
    let rawValue: String?
    let displayValue: String?
    let rawBytes: [Int]?
    let isPotential: Bool
    let value: BarcodeParsedValue?
  }

  struct BarcodeParsedValue {
    let type: String
    let data: [String: Any?]
  }
#endif  // MLKIT_BARCODE_SCANNING
