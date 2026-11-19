import Foundation
import NitroModules
import VisionCamera

final class HybridObjectDetector: HybridObjectDetectorSpec {
  private let options: ObjectDetectorOptions
  private let detectionQueue = DispatchQueue(
    label: "com.visioncameramlkit.object-detector"
  )
  #if MLKIT_OBJECT_DETECTION
    private let imagePreprocessor = ImagePreprocessor()
    private let imageOptions: ImagePreprocessingOptions
    private let detectionService: MLKitObjectDetectionService
    private let staticDetectionService: MLKitObjectDetectionService
  #endif

  init(options: ObjectDetectorOptions) {
    self.options = options
    #if MLKIT_OBJECT_DETECTION
      let resolvedOptions = options.toDomainObjectDetectionOptions()
      self.imageOptions = options.toImagePreprocessingOptions()
      self.detectionService = ObjectDetectionServiceFactory.create(options: resolvedOptions)
      self.staticDetectionService = ObjectDetectionServiceFactory.create(
        options: resolvedOptions
      )
    #endif
  }

  func detect(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws
    -> ObjectDetectionResult
  {
    #if MLKIT_OBJECT_DETECTION
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

      let result = try detectionService.recognize(image: processedImage)
      return result.remapped(using: processedImage.metadata).toNitroResult()
    #else
      throw RuntimeError.error(
        withMessage: "ObjectDetection is not enabled in the native ML Kit configuration.")
    #endif
  }

  func detectImage(uri: String) throws -> Promise<ObjectDetectionResult> {
    #if MLKIT_OBJECT_DETECTION
      return Promise.parallel(detectionQueue) {
        let imageFile = try StaticImageURLResolver.resolve(uri)
        guard
          let processedImage = self.imagePreprocessor.preprocessImage(
            imageFile: imageFile,
            options: self.imageOptions
          )
        else {
          throw RuntimeError.error(withMessage: "Failed to preprocess static image: \(uri)")
        }

        let result = try self.staticDetectionService.recognize(image: processedImage)
        return result.remapped(using: processedImage.metadata).toNitroResult()
      }
    #else
      return Promise.rejected(
        withError: RuntimeError.error(
          withMessage: "ObjectDetection is not enabled in the native ML Kit configuration."
        )
      )
    #endif
  }
}
