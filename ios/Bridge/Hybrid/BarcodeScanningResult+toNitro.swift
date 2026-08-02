#if MLKIT_BARCODE_SCANNING
  extension BarcodeScanningResult {
    func toNitroResult() throws -> BarcodeScannerResult {
      return BarcodeScannerResult(
        barcodes: try barcodes.map { try $0.toNitroBarcode() }
      )
    }
  }

  extension BarcodeData {
    fileprivate func toNitroBarcode() throws -> BarcodeScannerBarcode {
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
        value: try value?.toAnyMap(),
        isPotential: isPotential
      )
    }
  }
#endif
