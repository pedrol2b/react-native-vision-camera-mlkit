import Foundation
import NitroModules
import VisionCamera

final class HybridBarcodeScanner: HybridBarcodeScannerSpec {
  private let options: BarcodeScannerOptions
  #if MLKIT_BARCODE_SCANNING
    private let imagePreprocessor = ImagePreprocessor()
    private let barcodeOptions: BarcodeScanningOptions
    private let imageOptions: ImagePreprocessingOptions
    private let recognitionService: MLKitBarcodeScanningService
  #endif

  init(options: BarcodeScannerOptions) {
    self.options = options
    #if MLKIT_BARCODE_SCANNING
      let resolvedBarcodeOptions = options.toDomainBarcodeScanningOptions()
      self.barcodeOptions = resolvedBarcodeOptions
      self.imageOptions = options.toImagePreprocessingOptions()
      self.recognitionService = BarcodeScanningServiceFactory.create(
        options: resolvedBarcodeOptions
      )
    #endif
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws -> BarcodeScannerResult {
    #if MLKIT_BARCODE_SCANNING
      guard
        let processedImage = imagePreprocessor.preprocessFrame(
          frame: frame,
          options: imageOptions
        )
      else {
        throw RuntimeError.error(withMessage: "Failed to preprocess VisionCamera frame.")
      }

      return try recognitionService.recognize(image: processedImage).toNitroResult()
    #else
      throw RuntimeError.error(withMessage: "BarcodeScanning is not enabled in the native ML Kit configuration.")
    #endif
  }
}
