import Foundation

extension BarcodeScannerOptions {
  func toDomainBarcodeScanningOptions() -> BarcodeScanningOptions {
    return BarcodeScanningOptions(
      formats: formats?.map { $0.toDomainBarcodeFormat() } ?? [],
      enableAllPotentialBarcodes: enableAllPotentialBarcodes ?? false,
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0)
    )
  }

  func toImagePreprocessingOptions() -> ImagePreprocessingOptions {
    return ImagePreprocessingOptions(
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0),
      orientation: orientation?.toDomainOrientation(),
      roi: roi?.toDomainRegionOfInterest()
    )
  }
}
