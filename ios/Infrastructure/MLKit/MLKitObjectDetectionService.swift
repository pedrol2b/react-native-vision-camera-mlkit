import Foundation

#if MLKIT_OBJECT_DETECTION
  import MLKitObjectDetection

  class MLKitObjectDetectionService: IRecognitionService {
    typealias ResultType = DomainObjectDetectionResult

    private let objectDetector: MLKitObjectDetection.ObjectDetector

    init(objectDetector: MLKitObjectDetection.ObjectDetector) {
      self.objectDetector = objectDetector
    }

    func recognize(image: ProcessedImage) throws -> DomainObjectDetectionResult {
      let objects = try objectDetector.results(in: image.image)
      return MLKitObjectAdapter.toDomain(objects)
    }
  }
#endif  // MLKIT_OBJECT_DETECTION
