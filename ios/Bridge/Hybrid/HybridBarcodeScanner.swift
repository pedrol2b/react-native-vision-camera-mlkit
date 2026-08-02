import Foundation
import NitroModules
import VisionCamera

final class HybridBarcodeScanner: HybridBarcodeScannerSpec {
  private let options: BarcodeScannerOptions
  private let recognitionQueue = DispatchQueue(
    label: "com.visioncameramlkit.barcode-scanner"
  )
  #if MLKIT_BARCODE_SCANNING
    private let imagePreprocessor = ImagePreprocessor()
    private let barcodeOptions: BarcodeScanningOptions
    private let imageOptions: ImagePreprocessingOptions
    private let recognitionService: MLKitBarcodeScanningService
    private let staticRecognitionService: MLKitBarcodeScanningService
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
      self.staticRecognitionService = BarcodeScanningServiceFactory.create(
        options: resolvedBarcodeOptions
      )
    #endif
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws
    -> BarcodeScannerResult
  {
    #if MLKIT_BARCODE_SCANNING
      let callImageOptions = imageOptions.withOutputOrientation(
        args?.outputOrientation?.toOutputOrientation()
      )
      guard
        let processedImage = imagePreprocessor.preprocessFrame(
          frame: frame,
          options: callImageOptions
        )
      else {
        throw RuntimeError.error(withMessage: "Failed to preprocess VisionCamera frame.")
      }

      let result = try recognitionService.recognize(image: processedImage)
      return try result.remapped(using: processedImage.metadata).toNitroResult()
    #else
      throw RuntimeError.error(
        withMessage: "BarcodeScanning is not enabled in the native ML Kit configuration.")
    #endif
  }

  func recognizeImage(uri: String) throws -> Promise<BarcodeScannerResult> {
    #if MLKIT_BARCODE_SCANNING
      return Promise.parallel(recognitionQueue) {
        let imageFile = try StaticImageURLResolver.resolve(uri)
        guard
          let processedImage = self.imagePreprocessor.preprocessImage(
            imageFile: imageFile,
            options: self.imageOptions
          )
        else {
          throw RuntimeError.error(withMessage: "Failed to preprocess static image: \(uri)")
        }

        let result = try self.staticRecognitionService.recognize(image: processedImage)
        return try result.remapped(using: processedImage.metadata).toNitroResult()
      }
    #else
      return Promise.rejected(
        withError: RuntimeError.error(
          withMessage: "BarcodeScanning is not enabled in the native ML Kit configuration."
        )
      )
    #endif
  }
}
