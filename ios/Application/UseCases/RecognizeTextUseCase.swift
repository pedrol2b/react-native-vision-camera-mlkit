import Foundation

#if MLKIT_TEXT_RECOGNITION_ANY
  #if canImport(VisionCamera)
    import VisionCamera

    class RecognizeTextUseCase {
      private let imagePreprocessor: IImagePreprocessor
      private let recognitionService: MLKitTextRecognitionService

      init(
        imagePreprocessor: IImagePreprocessor,
        recognitionService: MLKitTextRecognitionService
      ) {
        self.imagePreprocessor = imagePreprocessor
        self.recognitionService = recognitionService
      }

      func execute(frame: any HybridFrameSpec, options: TextRecognitionOptions) throws
        -> DomainTextRecognitionResult
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
              domain: "RecognizeTextUseCase",
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
        textOptions: TextRecognitionOptions
      ) throws -> DomainTextRecognitionResult {
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
              domain: "RecognizeTextUseCase",
              code: -1,
              userInfo: [NSLocalizedDescriptionKey: "Failed to preprocess image"]
            )
          }

          return try recognitionService.recognize(image: processedImage)
        }
      }
    }
  #endif
#endif  // MLKIT_TEXT_RECOGNITION_ANY
