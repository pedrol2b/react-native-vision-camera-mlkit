import Foundation

#if MLKIT_BARCODE_SCANNING
  class StaticBarcodeScanningHandler: IStaticImageHandler {
    private var cachedUseCase: RecognizeBarcodeUseCase?
    private var cachedOptionsKey: String?

    private func getRecognizeBarcodeUseCase(
      options: BarcodeScanningOptions
    ) -> RecognizeBarcodeUseCase {
      let optionsKey = buildOptionsKey(options)
      if let useCase = cachedUseCase, cachedOptionsKey == optionsKey {
        return useCase
      }

      let newUseCase = RecognizeBarcodeUseCase(
        imagePreprocessor: ImagePreprocessor(),
        recognitionService: BarcodeScanningServiceFactory.create(options: options)
      )
      cachedUseCase = newUseCase
      cachedOptionsKey = optionsKey
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
          let barcodeOptions = parseBarcodeOptions(options)
          let recognizeBarcodeUseCase = getRecognizeBarcodeUseCase(options: barcodeOptions)

          let result = try recognizeBarcodeUseCase.execute(
            imageFile: fileURL,
            imageOptions: imageOptions,
            barcodeOptions: barcodeOptions
          )

          let serializedResult = BarcodeScanningSerializer.toReactNativeMap(result)
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
      let orientationString = options["orientation"] as? String ?? "portrait"
      let orientation = parseOrientation(orientationString)

      return ImagePreprocessingOptions(
        invertColors: invertColors,
        orientation: orientation
      )
    }

    private func parseBarcodeOptions(_ options: [String: Any])
      -> BarcodeScanningOptions
    {
      let formatStrings = (options["formats"] as? [String] ?? ["ALL"]).map {
        $0.uppercased()
      }
      let parsedFormats = formatStrings.compactMap { BarcodeFormatOption(rawValue: $0) }
      let formats = parsedFormats.isEmpty ? [.all] : parsedFormats
      let enableAllPotentialBarcodes = options["enableAllPotentialBarcodes"] as? Bool ?? false

      return BarcodeScanningOptions(
        formats: formats,
        enableAllPotentialBarcodes: enableAllPotentialBarcodes
      )
    }

    private func parseOrientation(_ orientation: String) -> Orientation {
      switch orientation {
      case "portrait":
        return .portrait
      case "portrait-upside-down":
        return .portraitUpsideDown
      case "landscape-left":
        return .landscapeLeft
      case "landscape-right":
        return .landscapeRight
      default:
        return .portrait
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

    private func buildOptionsKey(_ options: BarcodeScanningOptions) -> String {
      let formatsKey = options.formats.map { $0.rawValue }.sorted().joined(separator: ",")
      return "\(formatsKey)|\(options.enableAllPotentialBarcodes)"
    }
  }
#endif
