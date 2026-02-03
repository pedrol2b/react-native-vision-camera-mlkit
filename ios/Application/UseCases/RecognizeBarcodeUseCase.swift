import Foundation

#if MLKIT_BARCODE_SCANNING
  #if canImport(VisionCamera)
    import VisionCamera

    class RecognizeBarcodeUseCase {
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
        // autoreleasepool at frame boundary to drain autoreleased Obj-C objects
        // after each frame is processed, preventing buildup across multiple frames
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
              domain: "RecognizeBarcodeUseCase",
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
        // autoreleasepool here ensures predictable memory cleanup,
        // especially if this method is called repeatedly or in batches
        return try autoreleasepool {
          guard
            let processedImage = imagePreprocessor.preprocessImage(
              imageFile: imageFile,
              options: imageOptions
            )
          else {
            throw NSError(
              domain: "RecognizeBarcodeUseCase",
              code: -1,
              userInfo: [NSLocalizedDescriptionKey: "Failed to preprocess image"]
            )
          }

          return try recognitionService.recognize(image: processedImage)
        }
      }
    }
  #endif
#endif
