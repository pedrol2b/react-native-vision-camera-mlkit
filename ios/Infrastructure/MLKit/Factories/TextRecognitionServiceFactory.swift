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
  class TextRecognitionServiceFactory {

    static func createTextRecognizer(language: TextRecognitionLanguage)
      -> TextRecognizer
    {
      let options: CommonTextRecognizerOptions

      switch language {
      #if MLKIT_TEXT_RECOGNITION
        case .latin:
          options = TextRecognizerOptions()
      #endif
      #if MLKIT_TEXT_RECOGNITION_CHINESE
        case .chinese:
          options = ChineseTextRecognizerOptions()
      #endif
      #if MLKIT_TEXT_RECOGNITION_DEVANAGARI
        case .devanagari:
          options = DevanagariTextRecognizerOptions()
      #endif
      #if MLKIT_TEXT_RECOGNITION_JAPANESE
        case .japanese:
          options = JapaneseTextRecognizerOptions()
      #endif
      #if MLKIT_TEXT_RECOGNITION_KOREAN
        case .korean:
          options = KoreanTextRecognizerOptions()
      #endif
      }

      return TextRecognizer.textRecognizer(options: options)
    }

    static func create(language: TextRecognitionLanguage = .latin)
      -> MLKitTextRecognitionService
    {
      let textRecognizer = createTextRecognizer(language: language)
      return MLKitTextRecognitionService(textRecognizer: textRecognizer)
    }
  }
#endif
