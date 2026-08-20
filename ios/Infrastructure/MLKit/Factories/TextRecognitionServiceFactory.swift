import Foundation
import NitroModules

#if MLKIT_TEXT_RECOGNITION_ANY
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

#if MLKIT_TEXT_RECOGNITION_ANY
  class TextRecognitionServiceFactory {

    /// Recognizer options for `language`, or `nil` when that language model was
    /// excluded from this build by the selective ML Kit configuration.
    ///
    /// The `#if` guards live inside each `case` body rather than around the
    /// `case` labels themselves: that keeps the switch exhaustive under every
    /// combination of model flags, so adding a language to
    /// `DomainTextRecognitionLanguage` still fails the build until it is
    /// handled here.
    private static func makeOptions(for language: DomainTextRecognitionLanguage)
      -> CommonTextRecognizerOptions?
    {
      switch language {
      case .latin:
        #if MLKIT_TEXT_RECOGNITION
          return MLKitTextRecognition.TextRecognizerOptions()
        #else
          return nil
        #endif
      case .chinese:
        #if MLKIT_TEXT_RECOGNITION_CHINESE
          return ChineseTextRecognizerOptions()
        #else
          return nil
        #endif
      case .devanagari:
        #if MLKIT_TEXT_RECOGNITION_DEVANAGARI
          return DevanagariTextRecognizerOptions()
        #else
          return nil
        #endif
      case .japanese:
        #if MLKIT_TEXT_RECOGNITION_JAPANESE
          return JapaneseTextRecognizerOptions()
        #else
          return nil
        #endif
      case .korean:
        #if MLKIT_TEXT_RECOGNITION_KOREAN
          return KoreanTextRecognizerOptions()
        #else
          return nil
        #endif
      }
    }

    /// Configuration key that enables `language`'s model, as accepted by the
    /// `$VisionCameraMLKit` Podfile hash and the Expo config plugin.
    private static func configurationKey(for language: DomainTextRecognitionLanguage) -> String {
      switch language {
      case .latin: return "textRecognition"
      case .chinese: return "textRecognitionChinese"
      case .devanagari: return "textRecognitionDevanagari"
      case .japanese: return "textRecognitionJapanese"
      case .korean: return "textRecognitionKorean"
      }
    }

    static func createTextRecognizer(language: DomainTextRecognitionLanguage) throws
      -> TextRecognizer
    {
      guard let options = makeOptions(for: language) else {
        throw RuntimeError.error(
          withMessage:
            "Text recognition for \(language.rawValue) is not enabled in this build. "
            + "Set \(configurationKey(for: language)) to true in your ML Kit configuration."
        )
      }

      return TextRecognizer.textRecognizer(options: options)
    }

    static func create(language: DomainTextRecognitionLanguage = .latin) throws
      -> MLKitTextRecognitionService
    {
      let textRecognizer = try createTextRecognizer(language: language)
      return MLKitTextRecognitionService(textRecognizer: textRecognizer)
    }
  }
#endif  // MLKIT_TEXT_RECOGNITION_ANY
