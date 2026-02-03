import Foundation

#if MLKIT_BARCODE_SCANNING
  import MLKitBarcodeScanning

  class BarcodeScanningServiceFactory {
    static func create(options: BarcodeScanningOptions = BarcodeScanningOptions())
      -> MLKitBarcodeScanningService
    {
      let scanner = createBarcodeScanner(formats: options.formats)
      return MLKitBarcodeScanningService(barcodeScanner: scanner)
    }

    private static func createBarcodeScanner(formats: [BarcodeFormatOption])
      -> BarcodeScanner
    {
      let formatOptions = toBarcodeFormatOptions(formats)
      let options = BarcodeScannerOptions(formats: formatOptions)
      return BarcodeScanner.barcodeScanner(options: options)
    }

    private static func toBarcodeFormatOptions(_ formats: [BarcodeFormatOption])
      -> BarcodeFormat
    {
      if formats.isEmpty || formats.contains(.all) {
        return .all
      }

      var optionSet: BarcodeFormat = []
      for format in formats {
        switch format {
        case .code128:
          optionSet.insert(.code128)
        case .code39:
          optionSet.insert(.code39)
        case .code93:
          optionSet.insert(.code93)
        case .codabar:
          optionSet.insert(.codaBar)
        case .dataMatrix:
          optionSet.insert(.dataMatrix)
        case .ean13:
          optionSet.insert(.EAN13)
        case .ean8:
          optionSet.insert(.EAN8)
        case .itf:
          optionSet.insert(.ITF)
        case .qrCode:
          optionSet.insert(.qrCode)
        case .upcA:
          optionSet.insert(.UPCA)
        case .upcE:
          optionSet.insert(.UPCE)
        case .pdf417:
          optionSet.insert(.PDF417)
        case .aztec:
          optionSet.insert(.aztec)
        case .unknown, .all:
          break
        }
      }

      return optionSet.isEmpty ? .all : optionSet
    }
  }
#endif
