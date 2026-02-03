import Foundation

#if MLKIT_TEXT_RECOGNITION
  #if canImport(VisionCamera)
    import VisionCamera

    @objc(TextRecognitionPlugin)
    public class TextRecognitionPlugin: BaseMLKitPlugin {

      private let language: TextRecognitionLanguage

      private lazy var recognitionOptions: TextRecognitionOptions = {
        TextRecognitionOptions(
          language: self.language,
          invertColors: self.invertColors,
          scaleFactor: self.scaleFactor
        )
      }()

      private lazy var recognizeTextUseCase: RecognizeTextUseCase = {
        let textRecognizer = TextRecognitionServiceFactory.createTextRecognizer(
          language: self.language
        )
        let recognitionService = MLKitTextRecognitionService(
          textRecognizer: textRecognizer
        )
        let imagePreprocessor = ImagePreprocessor()

        return RecognizeTextUseCase(
          imagePreprocessor: imagePreprocessor,
          recognitionService: recognitionService
        )
      }()

      @objc
      public override init(
        proxy: VisionCameraProxyHolder,
        options: [AnyHashable: Any]? = [:]
      ) {
        let languageString = options?["language"] as? String ?? "LATIN"
        self.language =
          TextRecognitionLanguage(rawValue: languageString) ?? .latin

        super.init(proxy: proxy, options: options)
      }

      public override func processFrame(
        _ frame: Frame,
        withArguments arguments: [AnyHashable: Any]?
      ) throws -> [String: Any] {
        let options = TextRecognitionOptions(
          language: recognitionOptions.language,
          invertColors: recognitionOptions.invertColors,
          outputOrientation: outputOrientation,
          scaleFactor: recognitionOptions.scaleFactor
        )

        let result = try recognizeTextUseCase.execute(
          frame: frame,
          options: options
        )

        return TextRecognitionSerializer.toReactNativeMap(result)
      }
    }

  #endif
#endif
