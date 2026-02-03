import Foundation

#if MLKIT_BARCODE_SCANNING
  #if canImport(VisionCamera)
    import VisionCamera

    @objc(BarcodeScanningPlugin)
    public class BarcodeScanningPlugin: BaseMLKitPlugin {

      private var barcodeOptions: BarcodeScanningOptions

      private lazy var recognizeBarcodeUseCase: RecognizeBarcodeUseCase = {
        let recognitionService = BarcodeScanningServiceFactory.create(
          options: barcodeOptions
        )
        let imagePreprocessor = ImagePreprocessor()

        return RecognizeBarcodeUseCase(
          imagePreprocessor: imagePreprocessor,
          recognitionService: recognitionService
        )
      }()

      @objc
      public override init(
        proxy: VisionCameraProxyHolder,
        options: [AnyHashable: Any]? = [:]
      ) {
        let formatStrings = (options?["formats"] as? [String] ?? ["ALL"]).map {
          $0.uppercased()
        }
        let parsedFormats = formatStrings.compactMap { BarcodeFormatOption(rawValue: $0) }
        let formats = parsedFormats.isEmpty ? [.all] : parsedFormats
        let enableAllPotentialBarcodes = options?["enableAllPotentialBarcodes"] as? Bool ?? false

        self.barcodeOptions = BarcodeScanningOptions(
          formats: formats,
          enableAllPotentialBarcodes: enableAllPotentialBarcodes
        )

        super.init(proxy: proxy, options: options)

        self.barcodeOptions = BarcodeScanningOptions(
          formats: formats,
          enableAllPotentialBarcodes: enableAllPotentialBarcodes,
          invertColors: invertColors,
          scaleFactor: scaleFactor
        )
      }

      public override func processFrame(
        _ frame: Frame,
        withArguments arguments: [AnyHashable: Any]?
      ) throws -> [String: Any] {
        let options = BarcodeScanningOptions(
          formats: barcodeOptions.formats,
          enableAllPotentialBarcodes: barcodeOptions.enableAllPotentialBarcodes,
          invertColors: barcodeOptions.invertColors,
          outputOrientation: outputOrientation,
          scaleFactor: barcodeOptions.scaleFactor
        )

        let result = try recognizeBarcodeUseCase.execute(
          frame: frame,
          options: options
        )

        return BarcodeScanningSerializer.toReactNativeMap(result)
      }
    }

  #endif
#endif
