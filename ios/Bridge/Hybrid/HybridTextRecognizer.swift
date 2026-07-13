import Foundation
import NitroModules
import VisionCamera

final class HybridTextRecognizer: HybridTextRecognizerSpec {
  private let options: TextRecognizerOptions
  #if MLKIT_TEXT_RECOGNITION_ANY
    private let imagePreprocessor = ImagePreprocessor()
    private let textOptions: TextRecognitionOptions
    private let imageOptions: ImagePreprocessingOptions
    private let recognitionService: MLKitTextRecognitionService
  #endif

  init(options: TextRecognizerOptions) {
    self.options = options
    #if MLKIT_TEXT_RECOGNITION_ANY
      let resolvedTextOptions = options.toDomainTextRecognitionOptions()
      self.textOptions = resolvedTextOptions
      self.imageOptions = options.toImagePreprocessingOptions()
      self.recognitionService = TextRecognitionServiceFactory.create(
        language: resolvedTextOptions.language
      )
    #endif
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws -> TextRecognitionResult {
    #if MLKIT_TEXT_RECOGNITION_ANY
      guard
        let processedImage = imagePreprocessor.preprocessFrame(
          frame: frame,
          options: imageOptions
        )
      else {
        throw RuntimeError.error(withMessage: "Failed to preprocess VisionCamera frame.")
      }

      let result = try recognitionService.recognize(image: processedImage)
      return result.remapped(using: processedImage.metadata).toNitroResult()
    #else
      throw RuntimeError.error(withMessage: "TextRecognition is not enabled in the native ML Kit configuration.")
    #endif
  }
}
