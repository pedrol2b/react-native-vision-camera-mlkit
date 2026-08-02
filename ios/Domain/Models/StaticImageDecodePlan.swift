import Foundation

struct StaticImageDecodePlan: Equatable {
  let sourceWidth: Int
  let sourceHeight: Int
  let outputWidth: Int
  let outputHeight: Int

  var thumbnailMaxPixelSize: Int {
    max(outputWidth, outputHeight)
  }

  var outputPixelCount: Int {
    outputWidth * outputHeight
  }

  func sourceScaleFactor(decodedWidth: Int, decodedHeight: Int) -> Double {
    Double(max(decodedWidth, decodedHeight))
      / Double(max(sourceWidth, sourceHeight))
  }

  static func make(sourceWidth: Int, sourceHeight: Int) -> StaticImageDecodePlan? {
    guard
      sourceWidth > 0,
      sourceHeight > 0,
      sourceWidth <= StaticImageLimits.maxSourceDimension,
      sourceHeight <= StaticImageLimits.maxSourceDimension,
      sourceWidth <= StaticImageLimits.maxSourcePixelCount / sourceHeight
    else {
      return nil
    }

    let pixelScale = sqrt(
      Double(StaticImageLimits.maxDecodedPixelCount)
        / Double(sourceWidth * sourceHeight)
    )
    let dimensionScale =
      Double(StaticImageLimits.maxDecodedDimension)
      / Double(max(sourceWidth, sourceHeight))
    let scale = min(1, pixelScale, dimensionScale)

    let sourceMaxDimension = max(sourceWidth, sourceHeight)
    var maxPixelSize = max(1, Int(floor(Double(sourceMaxDimension) * scale)))

    while maxPixelSize > 0 {
      // ImageIO may round the secondary dimension up. Plan with ceil so the actual
      // thumbnail still satisfies the decoded pixel-count ceiling.
      let outputWidth = max(
        1,
        Int(
          ceil(
            Double(sourceWidth) * Double(maxPixelSize)
              / Double(sourceMaxDimension)
          )
        )
      )
      let outputHeight = max(
        1,
        Int(
          ceil(
            Double(sourceHeight) * Double(maxPixelSize)
              / Double(sourceMaxDimension)
          )
        )
      )

      if StaticImageLimits.acceptsDecoded(width: outputWidth, height: outputHeight) {
        return StaticImageDecodePlan(
          sourceWidth: sourceWidth,
          sourceHeight: sourceHeight,
          outputWidth: outputWidth,
          outputHeight: outputHeight
        )
      }
      maxPixelSize -= 1
    }

    return nil
  }
}
