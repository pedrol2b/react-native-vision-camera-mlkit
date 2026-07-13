import Foundation

#if MLKIT_BARCODE_SCANNING
  #if canImport(VisionCamera)
    import VisionCamera

    class RecognizeBarcodesUseCase {
      private let imagePreprocessor: IImagePreprocessor
      private let recognitionService: MLKitBarcodeScanningService

      init(
        imagePreprocessor: IImagePreprocessor,
        recognitionService: MLKitBarcodeScanningService
      ) {
        self.imagePreprocessor = imagePreprocessor
        self.recognitionService = recognitionService
      }

      func execute(frame: any HybridFrameSpec, options: BarcodeScanningOptions) throws
        -> BarcodeScanningResult
      {
        return try autoreleasepool {
          let preprocessingOptions = ImagePreprocessingOptions(
            invertColors: options.invertColors,
            outputOrientation: options.outputOrientation,
            scaleFactor: options.scaleFactor
          )

          guard
            let processedImage = imagePreprocessor.preprocessFrame(
              frame: frame,
              options: preprocessingOptions
            )
          else {
            throw NSError(
              domain: "RecognizeBarcodesUseCase",
              code: -1,
              userInfo: [NSLocalizedDescriptionKey: "Failed to preprocess image"]
            )
          }

          let result = try recognitionService.recognize(image: processedImage)
          return result.remapped(using: processedImage.metadata)
        }
      }

      func execute(
        imageFile: URL,
        imageOptions: ImagePreprocessingOptions,
        barcodeOptions: BarcodeScanningOptions
      ) throws -> BarcodeScanningResult {
        return try autoreleasepool {
          let preprocessingOptions = ImagePreprocessingOptions(
            invertColors: imageOptions.invertColors,
            outputOrientation: imageOptions.outputOrientation,
            scaleFactor: imageOptions.scaleFactor,
            orientation: imageOptions.orientation,
            roi: imageOptions.roi
          )

          guard
            let processedImage = imagePreprocessor.preprocessImage(
              imageFile: imageFile,
              options: preprocessingOptions
            )
          else {
            throw NSError(
              domain: "RecognizeBarcodesUseCase",
              code: -1,
              userInfo: [NSLocalizedDescriptionKey: "Failed to preprocess image"]
            )
          }

          _ = barcodeOptions
          let result = try recognitionService.recognize(image: processedImage)
          return result.remapped(using: processedImage.metadata)
        }
      }
    }
  #endif
#endif  // MLKIT_BARCODE_SCANNING
