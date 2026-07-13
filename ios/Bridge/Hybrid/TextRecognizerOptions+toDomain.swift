import Foundation

extension TextRecognizerOptions {
  func toDomainTextRecognitionOptions() -> TextRecognitionOptions {
    return TextRecognitionOptions(
      language: language?.toDomainLanguage() ?? .latin,
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0)
    )
  }

  func toImagePreprocessingOptions() -> ImagePreprocessingOptions {
    return ImagePreprocessingOptions(
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0),
      roi: roi?.toDomainRegionOfInterest()
    )
  }
}
