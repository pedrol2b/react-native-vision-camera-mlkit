import Foundation
import NitroModules
import VisionCamera

final class HybridBarcodeScanner: HybridBarcodeScannerSpec {
  private let options: BarcodeScannerOptions

  init(options: BarcodeScannerOptions) {
    self.options = options
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws -> BarcodeScannerResult {
    throw RuntimeError.error(withMessage: "VisionCamera v5 barcode frame processing is not implemented yet.")
  }
}
