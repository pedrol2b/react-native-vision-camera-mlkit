import Foundation

public struct ImagePreprocessingOptions {
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat
  let orientation: DomainOrientation?
  let roi: DomainRegionOfInterest?

  init(
    invertColors: Bool = false,
    outputOrientation: OutputOrientation? = nil,
    scaleFactor: CGFloat = 1.0,
    orientation: DomainOrientation? = nil,
    roi: DomainRegionOfInterest? = nil
  ) {
    self.invertColors = invertColors
    self.outputOrientation = outputOrientation
    self.scaleFactor = scaleFactor
    self.orientation = orientation
    self.roi = roi
  }
}
