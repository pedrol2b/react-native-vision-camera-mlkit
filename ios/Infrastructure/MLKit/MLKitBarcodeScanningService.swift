import Foundation

#if MLKIT_BARCODE_SCANNING
  import MLKitBarcodeScanning

  class MLKitBarcodeScanningService: IRecognitionService {
    typealias ResultType = BarcodeScanningResult

    private let barcodeScanner: BarcodeScanner

    init(barcodeScanner: BarcodeScanner) {
      self.barcodeScanner = barcodeScanner
    }

    func recognize(image: ProcessedImage) throws -> BarcodeScanningResult {
      let barcodes = try barcodeScanner.results(in: image.image)
      return MLKitBarcodeAdapter.toDomain(barcodes)
    }
  }
#endif
