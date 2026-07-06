import Foundation

#if MLKIT_TEXT_RECOGNITION_ANY
  class StaticTextRecognitionHandler: IStaticImageHandler {
    private let textRecognitionSerializer = TextRecognitionSerializer()
    private var cachedUseCase: RecognizeTextUseCase?

    private func getRecognizeTextUseCase(for language: DomainTextRecognitionLanguage)
      -> RecognizeTextUseCase
    {
      if let useCase = cachedUseCase {
        return useCase
      }
      let newUseCase = RecognizeTextUseCase(
        imagePreprocessor: ImagePreprocessor(),
        recognitionService: TextRecognitionServiceFactory.create(
          language: language
        )
      )
      cachedUseCase = newUseCase
      return newUseCase
    }

    func process(
      path: String,
      options: [String: Any],
      resolver: @escaping PromiseResolver,
      rejecter: @escaping PromiseRejecter
    ) {
      Task {
        do {
          guard let fileURL = resolveFileURL(from: path) else {
            rejecter(
              "IMAGE_NOT_FOUND_ERROR",
              "Unsupported image URI: \(path)",
              nil
            )
            return
          }

          if fileURL.isFileURL
            && !FileManager.default.fileExists(atPath: fileURL.path)
          {
            rejecter(
              "IMAGE_NOT_FOUND_ERROR",
              "Image file not found at path: \(path)",
              nil
            )
            return
          }

          let imageOptions = parseImageOptions(options)

          let languageString = options["language"] as? String ?? "LATIN"
          let language = parseLanguage(languageString)
          let textOptions = TextRecognitionOptions(language: language)

          let recognizeTextUseCase = getRecognizeTextUseCase(for: language)

          let result = try recognizeTextUseCase.execute(
            imageFile: fileURL,
            imageOptions: imageOptions,
            textOptions: textOptions
          )

          let serializedResult = TextRecognitionSerializer.toReactNativeMap(
            result
          )

          resolver(serializedResult)
        } catch {
          switch error {
          case let nsError as NSError:
            if nsError.domain == NSCocoaErrorDomain
              && nsError.code == NSFileReadNoSuchFileError
            {
              rejecter("IMAGE_NOT_FOUND_ERROR", "Image file not found", error)
            } else {
              rejecter(
                "IMAGE_PROCESSING_FAILED_ERROR",
                error.localizedDescription,
                error
              )
            }
          default:
            rejecter(
              "IMAGE_PROCESSING_FAILED_ERROR",
              error.localizedDescription,
              error
            )
          }
        }
      }
    }

    private func parseImageOptions(_ options: [String: Any])
      -> ImagePreprocessingOptions
    {
      let invertColors = options["invertColors"] as? Bool ?? false
      let orientation = (options["orientation"] as? String).flatMap { DomainOrientation(string: $0) }

      return ImagePreprocessingOptions(
        invertColors: invertColors,
        orientation: orientation
      )
    }

    private func parseLanguage(_ language: String) -> DomainTextRecognitionLanguage {
      switch language {
      case "LATIN":
        return .latin
      case "CHINESE":
        return .chinese
      case "DEVANAGARI":
        return .devanagari
      case "JAPANESE":
        return .japanese
      case "KOREAN":
        return .korean
      default:
        return .latin
      }
    }

    private func resolveFileURL(from path: String) -> URL? {
      if path.hasPrefix("file://") {
        return URL(string: path)
      }

      if let url = URL(string: path), url.scheme != nil {
        return url
      }

      return URL(fileURLWithPath: path)
    }
  }
#endif  // MLKIT_TEXT_RECOGNITION_ANY
