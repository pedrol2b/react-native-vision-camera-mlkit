import Foundation
import NitroModules
import VisionCamera

final class HybridTextRecognizer: HybridTextRecognizerSpec {
  private let options: TextRecognizerOptions
  private let recognitionQueue = DispatchQueue(
    label: "com.visioncameramlkit.text-recognizer"
  )
  #if MLKIT_TEXT_RECOGNITION_ANY
    private let imagePreprocessor = ImagePreprocessor()
    private let textOptions: TextRecognitionOptions
    private let imageOptions: ImagePreprocessingOptions
    private let recognitionService: MLKitTextRecognitionService
    private let staticRecognitionService: MLKitTextRecognitionService
  #endif

  init(options: TextRecognizerOptions) throws {
    self.options = options
    #if MLKIT_TEXT_RECOGNITION_ANY
      let resolvedTextOptions = options.toDomainTextRecognitionOptions()
      self.textOptions = resolvedTextOptions
      self.imageOptions = options.toImagePreprocessingOptions()
      self.recognitionService = try TextRecognitionServiceFactory.create(
        language: resolvedTextOptions.language
      )
      self.staticRecognitionService = try TextRecognitionServiceFactory.create(
        language: resolvedTextOptions.language
      )
    #endif
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws
    -> TextRecognitionResult
  {
    #if MLKIT_TEXT_RECOGNITION_ANY
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
      return result.remapped(using: processedImage.metadata).toNitroResult()
    #else
      throw RuntimeError.error(
        withMessage: "TextRecognition is not enabled in the native ML Kit configuration.")
    #endif
  }

  func recognizeImage(uri: String) throws -> Promise<TextRecognitionResult> {
    #if MLKIT_TEXT_RECOGNITION_ANY
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
        return result.remapped(using: processedImage.metadata).toNitroResult()
      }
    #else
      return Promise.rejected(
        withError: RuntimeError.error(
          withMessage: "TextRecognition is not enabled in the native ML Kit configuration."
        )
      )
    #endif
  }
}
