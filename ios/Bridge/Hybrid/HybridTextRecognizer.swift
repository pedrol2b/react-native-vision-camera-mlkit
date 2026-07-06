import Foundation
import NitroModules
import VisionCamera

final class HybridTextRecognizer: HybridTextRecognizerSpec {
  private let options: TextRecognizerOptions

  init(options: TextRecognizerOptions) {
    self.options = options
  }

  func recognize(frame: any HybridFrameSpec, args: MLKitBaseArguments?) throws -> TextRecognitionResult {
    throw RuntimeError.error(withMessage: "VisionCamera v5 text recognition frame processing is not implemented yet.")
  }
}
