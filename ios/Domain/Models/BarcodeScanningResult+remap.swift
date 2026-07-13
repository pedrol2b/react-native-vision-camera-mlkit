import Foundation

#if MLKIT_BARCODE_SCANNING
  #if canImport(MLKitVision)
    import MLKitVision

    extension BarcodeScanningResult {
      /// Remaps each barcode's bounding box and corner points back onto full-source-image
      /// coordinates, undoing the ROI crop offset and preprocessing scale.
      func remapped(using metadata: ImageMetadata) -> BarcodeScanningResult {
        return BarcodeScanningResult(
          barcodes: barcodes.map { $0.remapped(using: metadata) }
        )
      }
    }

    extension BarcodeData {
      fileprivate func remapped(using metadata: ImageMetadata) -> BarcodeData {
        return BarcodeData(
          bounds: bounds?.remapped(using: metadata),
          corners: corners?.map { $0.remapped(using: metadata) },
          format: format,
          formatName: formatName,
          valueType: valueType,
          valueTypeName: valueTypeName,
          rawValue: rawValue,
          displayValue: displayValue,
          rawBytes: rawBytes,
          isPotential: isPotential,
          value: value
        )
      }
    }
  #endif
#endif  // MLKIT_BARCODE_SCANNING
