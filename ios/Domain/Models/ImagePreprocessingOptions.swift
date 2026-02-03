import Foundation

public struct ImagePreprocessingOptions {
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat
  let orientation: Orientation

  public init(
    invertColors: Bool = false,
    outputOrientation: OutputOrientation? = nil,
    scaleFactor: CGFloat = 1.0,
    orientation: Orientation = .portrait
  ) {
    self.invertColors = invertColors
    self.outputOrientation = outputOrientation
    self.scaleFactor = scaleFactor
    self.orientation = orientation
  }
}
