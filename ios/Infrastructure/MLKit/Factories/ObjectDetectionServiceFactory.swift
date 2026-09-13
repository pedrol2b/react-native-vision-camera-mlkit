import Foundation

#if MLKIT_OBJECT_DETECTION
  import MLKitObjectDetection

  class ObjectDetectionServiceFactory {

    private static func makeOptions(for options: ObjectDetectionOptions)
      -> MLKitObjectDetection.ObjectDetectorOptions
    {
      let detectorOptions = MLKitObjectDetection.ObjectDetectorOptions()
      detectorOptions.detectorMode =
        options.detectorMode == .singleImage ? .singleImage : .stream
      detectorOptions.shouldEnableMultipleObjects = options.shouldEnableMultipleObjects
      detectorOptions.shouldEnableClassification = options.shouldEnableClassification

      return detectorOptions
    }

    static func create(options: ObjectDetectionOptions) -> MLKitObjectDetectionService {
      let objectDetector = MLKitObjectDetection.ObjectDetector.objectDetector(
        options: makeOptions(for: options)
      )

      return MLKitObjectDetectionService(objectDetector: objectDetector)
    }
  }
#endif  // MLKIT_OBJECT_DETECTION
