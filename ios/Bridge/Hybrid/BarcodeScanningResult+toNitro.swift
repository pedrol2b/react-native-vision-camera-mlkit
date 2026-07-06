extension BarcodeScanningResult {
  func toNitroResult() -> BarcodeScannerResult {
    return BarcodeScannerResult(
      barcodes: barcodes.map { $0.toNitroBarcode() }
    )
  }
}

private extension BarcodeData {
  func toNitroBarcode() -> BarcodeScannerBarcode {
    return BarcodeScannerBarcode(
      bounds: bounds?.toNitroBoundingBox(),
      corners: corners?.map { $0.toNitroCorner() },
      format: Double(format),
      formatName: BarcodeFormat(fromString: formatName) ?? .unknown,
      valueType: Double(valueType),
      valueTypeName: BarcodeValueTypeName(fromString: valueTypeName) ?? .typeUnknown,
      rawValue: rawValue,
      displayValue: displayValue,
      rawBytes: rawBytes?.map { Double($0) },
      isPotential: isPotential
    )
  }
}
