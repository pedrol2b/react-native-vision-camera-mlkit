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

      func execute(frame: Frame, options: BarcodeScanningOptions) throws
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

          return try recognitionService.recognize(image: processedImage)
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
            scaleFactor: imageOptions.scaleFactor,
            orientation: imageOptions.orientation
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
          return try recognitionService.recognize(image: processedImage)
        }
      }
    }
  #endif
#endif  // MLKIT_BARCODE_SCANNING
