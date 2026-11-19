import Foundation

extension ObjectDetectorOptions {
  func toDomainObjectDetectionOptions() -> ObjectDetectionOptions {
    return ObjectDetectionOptions(
      detectorMode: detectorMode?.toDomainDetectorMode() ?? .stream,
      shouldEnableMultipleObjects: shouldEnableMultipleObjects ?? false,
      shouldEnableClassification: shouldEnableClassification ?? false,
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0)
    )
  }

  func toImagePreprocessingOptions() -> ImagePreprocessingOptions {
    return ImagePreprocessingOptions(
      invertColors: invertColors ?? false,
      scaleFactor: CGFloat(scaleFactor ?? 1.0),
      orientation: orientation?.toDomainOrientation(),
      roi: roi?.toDomainRegionOfInterest()
    )
  }
}
