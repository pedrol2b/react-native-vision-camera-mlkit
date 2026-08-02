extension ImagePreprocessingOptions {
  func withOutputOrientation(_ outputOrientation: OutputOrientation?) -> ImagePreprocessingOptions {
    return ImagePreprocessingOptions(
      invertColors: invertColors,
      outputOrientation: outputOrientation,
      scaleFactor: scaleFactor,
      orientation: orientation,
      roi: roi
    )
  }
}
