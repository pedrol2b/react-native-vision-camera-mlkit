extension BarcodeFormat {
  func toDomainBarcodeFormat() -> BarcodeFormatOption {
    return BarcodeFormatOption(rawValue: stringValue) ?? .formatUnknown
  }
}
