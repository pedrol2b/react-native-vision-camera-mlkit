enum StaticImageLimits {
  static let maxEncodedBytes = 25 * 1024 * 1024
  static let maxSourcePixelCount = 25_000_000
  static let maxSourceDimension = 10_000
  static let maxDecodedPixelCount = 4_000_000
  static let maxDecodedDimension = 4_096

  static func acceptsFile(
    isRegularFile: Bool?,
    isSymbolicLink: Bool?,
    encodedBytes: Int?
  ) -> Bool {
    guard let encodedBytes else {
      return false
    }
    return isRegularFile == true
      && isSymbolicLink == false
      && encodedBytes >= 0
      && encodedBytes <= maxEncodedBytes
  }

  static func acceptsDecoded(width: Int, height: Int) -> Bool {
    width > 0
      && height > 0
      && width <= maxDecodedDimension
      && height <= maxDecodedDimension
      && width <= maxDecodedPixelCount / height
  }
}
