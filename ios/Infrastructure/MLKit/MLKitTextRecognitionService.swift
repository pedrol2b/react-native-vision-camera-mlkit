import Foundation

#if MLKIT_TEXT_RECOGNITION
  import MLKitTextRecognition
#endif

#if MLKIT_TEXT_RECOGNITION_CHINESE
  import MLKitTextRecognitionChinese
#endif

#if MLKIT_TEXT_RECOGNITION_DEVANAGARI
  import MLKitTextRecognitionDevanagari
#endif

#if MLKIT_TEXT_RECOGNITION_JAPANESE
  import MLKitTextRecognitionJapanese
#endif

#if MLKIT_TEXT_RECOGNITION_KOREAN
  import MLKitTextRecognitionKorean
#endif

#if MLKIT_TEXT_RECOGNITION
  class MLKitTextRecognitionService: IRecognitionService {
    typealias ResultType = TextRecognitionResult

    private let textRecognizer: TextRecognizer

    init(textRecognizer: TextRecognizer) {
      self.textRecognizer = textRecognizer
    }

    func recognize(image: ProcessedImage) throws -> TextRecognitionResult {
      let text = try textRecognizer.results(in: image.image)
      return MLKitTextAdapter.toDomain(text)
    }
  }
#endif
