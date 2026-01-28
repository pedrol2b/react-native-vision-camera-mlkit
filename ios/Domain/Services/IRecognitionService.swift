import Foundation

protocol IRecognitionService {
  associatedtype ResultType
  func recognize(image: ProcessedImage) throws -> ResultType
}
