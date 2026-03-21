import Foundation

#if MLKIT_BARCODE_SCANNING
  struct BarcodeScanningOptions {
    let formats: [BarcodeFormatOption]
    let enableAllPotentialBarcodes: Bool
    let invertColors: Bool
    let outputOrientation: OutputOrientation?
    let scaleFactor: CGFloat

    init(
      formats: [BarcodeFormatOption] = [],
      enableAllPotentialBarcodes: Bool = false,
      invertColors: Bool = false,
      outputOrientation: OutputOrientation? = nil,
      scaleFactor: CGFloat = 1.0
    ) {
      self.formats = formats
      self.enableAllPotentialBarcodes = enableAllPotentialBarcodes
      self.invertColors = invertColors
      self.outputOrientation = outputOrientation
      self.scaleFactor = scaleFactor
    }
  }

  enum BarcodeFormatOption: String, CaseIterable {
    case formatUnknown = "UNKNOWN"
    case formatAllFormats = "ALL_FORMATS"
    case formatCode128 = "CODE_128"
    case formatCode39 = "CODE_39"
    case formatCode93 = "CODE_93"
    case formatCodabar = "CODABAR"
    case formatDataMatrix = "DATA_MATRIX"
    case formatEan13 = "EAN_13"
    case formatEan8 = "EAN_8"
    case formatItf = "ITF"
    case formatQrCode = "QR_CODE"
    case formatUpcA = "UPC_A"
    case formatUpcE = "UPC_E"
    case formatPdf417 = "PDF417"
    case formatAztec = "AZTEC"
  }
#endif  // MLKIT_BARCODE_SCANNING
