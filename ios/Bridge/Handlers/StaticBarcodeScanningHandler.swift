import Foundation

#if MLKIT_BARCODE_SCANNING
  class StaticBarcodeScanningHandler: IStaticImageHandler {
    private var cachedUseCases: [String: RecognizeBarcodesUseCase] = [:]

    private func getRecognizeBarcodesUseCase(for options: BarcodeScanningOptions)
      -> RecognizeBarcodesUseCase
    {
      let key =
        "\(options.enableAllPotentialBarcodes)|\(options.formats.map(\.rawValue).joined(separator: ","))"

      if let useCase = cachedUseCases[key] {
        return useCase
      }

      let newUseCase = RecognizeBarcodesUseCase(
        imagePreprocessor: ImagePreprocessor(),
        recognitionService: BarcodeScanningServiceFactory.create(options: options)
      )
      cachedUseCases[key] = newUseCase
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
          let recognizeBarcodesUseCase = getRecognizeBarcodesUseCase(for: barcodeOptions)

          let result = try recognizeBarcodesUseCase.execute(
            imageFile: fileURL,
            imageOptions: imageOptions,
            barcodeOptions: barcodeOptions
          )

          resolver(BarcodeScanningSerializer.toReactNativeMap(result))
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
      let scaleFactor = CGFloat((options["scaleFactor"] as? NSNumber)?.doubleValue ?? 1.0)
      let roi = parseRegionOfInterest(options["roi"])

      return ImagePreprocessingOptions(
        invertColors: invertColors,
        scaleFactor: scaleFactor,
        orientation: orientation,
        roi: roi
      )
    }

    private func parseRegionOfInterest(_ value: Any?) -> DomainRegionOfInterest? {
      guard let dictionary = value as? [String: Any],
        let x = (dictionary["x"] as? NSNumber)?.doubleValue,
        let y = (dictionary["y"] as? NSNumber)?.doubleValue,
        let width = (dictionary["width"] as? NSNumber)?.doubleValue,
        let height = (dictionary["height"] as? NSNumber)?.doubleValue
      else {
        return nil
      }

      let unit: DomainRegionOfInterestUnit =
        (dictionary["unit"] as? String) == "pixel" ? .pixel : .normalized

      return DomainRegionOfInterest(
        x: CGFloat(x),
        y: CGFloat(y),
        width: CGFloat(width),
        height: CGFloat(height),
        unit: unit
      )
    }

    private func parseBarcodeOptions(_ options: [String: Any])
      -> BarcodeScanningOptions
    {
      return BarcodeScanningOptions(
        formats: BarcodeScanningOptionParser.parseFormats(options["formats"]),
        enableAllPotentialBarcodes:
          BarcodeScanningOptionParser
          .parseEnableAllPotentialBarcodes(options["enableAllPotentialBarcodes"])
      )
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
#endif  // MLKIT_BARCODE_SCANNING
