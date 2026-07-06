import Foundation

public struct ImagePreprocessingOptions {
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat
  let orientation: DomainOrientation?

  public init(
    invertColors: Bool = false,
    outputOrientation: OutputOrientation? = nil,
    scaleFactor: CGFloat = 1.0,
    orientation: DomainOrientation? = nil
  ) {
    self.invertColors = invertColors
    self.outputOrientation = outputOrientation
    self.scaleFactor = scaleFactor
    self.orientation = orientation
  }
}
