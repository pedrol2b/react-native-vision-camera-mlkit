import Foundation

struct ObjectDetectionOptions {
  let detectorMode: DomainObjectDetectorMode
  let shouldEnableMultipleObjects: Bool
  let shouldEnableClassification: Bool
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat

  init(
    detectorMode: DomainObjectDetectorMode = .stream,
    shouldEnableMultipleObjects: Bool = false,
    shouldEnableClassification: Bool = false,
    invertColors: Bool = false,
    outputOrientation: OutputOrientation? = nil,
    scaleFactor: CGFloat = 1.0
  ) {
    self.detectorMode = detectorMode
    self.shouldEnableMultipleObjects = shouldEnableMultipleObjects
    self.shouldEnableClassification = shouldEnableClassification
    self.invertColors = invertColors
    self.outputOrientation = outputOrientation
    self.scaleFactor = scaleFactor
  }
}

enum DomainObjectDetectorMode: String {
  case stream = "stream"
  case singleImage = "singleImage"
}
