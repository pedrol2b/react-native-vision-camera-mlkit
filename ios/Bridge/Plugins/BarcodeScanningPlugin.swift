import Foundation

#if MLKIT_BARCODE_SCANNING
  #if canImport(VisionCamera)
    import VisionCamera

    @objc(BarcodeScanningPlugin)
    public class BarcodeScanningPlugin: BaseMLKitPlugin {

      private lazy var recognitionOptions: BarcodeScanningOptions = {
        BarcodeScanningOptions(
          formats: BarcodeScanningOptionParser.parseFormats(self.options?["formats"]),
          enableAllPotentialBarcodes: BarcodeScanningOptionParser.parseEnableAllPotentialBarcodes(
            self.options?["enableAllPotentialBarcodes"]
          ),
          invertColors: self.invertColors,
          scaleFactor: self.scaleFactor
        )
      }()

      private lazy var recognizeBarcodesUseCase: RecognizeBarcodesUseCase = {
        let recognitionService = BarcodeScanningServiceFactory.create(
          options: self.recognitionOptions)
        let imagePreprocessor = ImagePreprocessor()

        return RecognizeBarcodesUseCase(
          imagePreprocessor: imagePreprocessor,
          recognitionService: recognitionService
        )
      }()

      public override func processFrame(
        _ frame: Frame,
        withArguments arguments: [AnyHashable: Any]?
      ) throws -> [String: Any] {
        let options = BarcodeScanningOptions(
          formats: recognitionOptions.formats,
          enableAllPotentialBarcodes: recognitionOptions.enableAllPotentialBarcodes,
          invertColors: recognitionOptions.invertColors,
          outputOrientation: outputOrientation,
          scaleFactor: recognitionOptions.scaleFactor
        )

        _ = arguments
        let result = try recognizeBarcodesUseCase.execute(frame: frame, options: options)
        return BarcodeScanningSerializer.toReactNativeMap(result)
      }
    }
  #endif
#endif  // MLKIT_BARCODE_SCANNING
