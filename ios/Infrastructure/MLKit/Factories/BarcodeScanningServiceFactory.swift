import Foundation

#if MLKIT_BARCODE_SCANNING
  import MLKitBarcodeScanning

  class BarcodeScanningServiceFactory {

    static func createBarcodeScanner(options: BarcodeScanningOptions)
      -> BarcodeScanner
    {
      let scannerOptions: MLKitBarcodeScanning.BarcodeScannerOptions
      if options.formats.isEmpty || options.formats.contains(.formatAllFormats) {
        scannerOptions = MLKitBarcodeScanning.BarcodeScannerOptions()
      } else {
        scannerOptions = MLKitBarcodeScanning.BarcodeScannerOptions(
          formats: toMLKitFormats(options.formats)
        )
      }
      return BarcodeScanner.barcodeScanner(options: scannerOptions)
    }

    static func create(options: BarcodeScanningOptions = BarcodeScanningOptions())
      -> MLKitBarcodeScanningService
    {
      let scanner = createBarcodeScanner(options: options)
      return MLKitBarcodeScanningService(barcodeScanner: scanner)
    }

    private static func toMLKitFormats(_ formats: [BarcodeFormatOption])
      -> MLKitBarcodeScanning.BarcodeFormat
    {
      var rawValue = 0
      for format in formats {
        switch format {
        case .formatUnknown, .formatAllFormats:
          continue
        case .formatCode128:
          rawValue |= 1
        case .formatCode39:
          rawValue |= 2
        case .formatCode93:
          rawValue |= 4
        case .formatCodabar:
          rawValue |= 8
        case .formatDataMatrix:
          rawValue |= 16
        case .formatEan13:
          rawValue |= 32
        case .formatEan8:
          rawValue |= 64
        case .formatItf:
          rawValue |= 128
        case .formatQrCode:
          rawValue |= 256
        case .formatUpcA:
          rawValue |= 512
        case .formatUpcE:
          rawValue |= 1024
        case .formatPdf417:
          rawValue |= 2048
        case .formatAztec:
          rawValue |= 4096
        }
      }

      return MLKitBarcodeScanning.BarcodeFormat(rawValue: rawValue)
    }
  }
#endif  // MLKIT_BARCODE_SCANNING
