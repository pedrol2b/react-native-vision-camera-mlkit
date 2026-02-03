import Foundation

struct BarcodeScanningOptions {
  let formats: [BarcodeFormatOption]
  let enableAllPotentialBarcodes: Bool
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat

  init(
    formats: [BarcodeFormatOption] = [.all],
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

enum BarcodeFormatOption: String {
  case unknown = "UNKNOWN"
  case all = "ALL"
  case code128 = "CODE_128"
  case code39 = "CODE_39"
  case code93 = "CODE_93"
  case codabar = "CODABAR"
  case dataMatrix = "DATA_MATRIX"
  case ean13 = "EAN_13"
  case ean8 = "EAN_8"
  case itf = "ITF"
  case qrCode = "QR_CODE"
  case upcA = "UPC_A"
  case upcE = "UPC_E"
  case pdf417 = "PDF417"
  case aztec = "AZTEC"
}

enum BarcodeValueTypeOption: String {
  case unknown = "UNKNOWN"
  case contactInfo = "CONTACT_INFO"
  case email = "EMAIL"
  case isbn = "ISBN"
  case phone = "PHONE"
  case product = "PRODUCT"
  case sms = "SMS"
  case text = "TEXT"
  case url = "URL"
  case wifi = "WIFI"
  case geo = "GEO"
  case calendarEvent = "CALENDAR_EVENT"
  case driverLicense = "DRIVER_LICENSE"
}
