import Foundation

struct TextRecognitionOptions {
  let language: TextRecognitionLanguage
  let invertColors: Bool
  let outputOrientation: OutputOrientation?
  let scaleFactor: CGFloat

  init(
    language: TextRecognitionLanguage = .latin,
    invertColors: Bool = false,
    outputOrientation: OutputOrientation? = nil,
    scaleFactor: CGFloat = 1.0
  ) {
    self.language = language
    self.invertColors = invertColors
    self.outputOrientation = outputOrientation
    self.scaleFactor = scaleFactor
  }
}

enum TextRecognitionLanguage: String {
  case latin = "LATIN"
  case chinese = "CHINESE"
  case devanagari = "DEVANAGARI"
  case japanese = "JAPANESE"
  case korean = "KOREAN"
}
