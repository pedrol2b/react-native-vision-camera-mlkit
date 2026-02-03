import Foundation

struct BarcodeScanningResult {
  let barcodes: [BarcodeResult]
}

struct BarcodeResult {
  let bounds: BoundingBox?
  let corners: [Corner]?
  let rawValue: String?
  let displayValue: String?
  let format: BarcodeFormatOption
  let valueType: BarcodeValueTypeOption
  let content: [String: Any]?
}
