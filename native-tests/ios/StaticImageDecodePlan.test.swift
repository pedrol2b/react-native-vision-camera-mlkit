import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

@main
enum StaticImageDecodePlanTests {
  static func main() {
    guard
      let phonePhoto = StaticImageDecodePlan.make(
        sourceWidth: 4_032,
        sourceHeight: 3_024
      )
    else {
      fatalError("A standard 12 MP phone photo should be accepted for bounded decode")
    }

    precondition(phonePhoto.thumbnailMaxPixelSize == 2_309)
    precondition(phonePhoto.outputWidth == 2_309)
    precondition(phonePhoto.outputHeight == 1_732)
    precondition(phonePhoto.outputPixelCount <= 4_000_000)
    precondition(
      abs(
        phonePhoto.sourceScaleFactor(decodedWidth: 2_309, decodedHeight: 1_732)
          - (2_309.0 / 4_032.0)
      )
        < 0.000_000_1,
      "The decode scale must be retained so results can map back to source coordinates"
    )

    precondition(
      StaticImageDecodePlan.make(
        sourceWidth: 10_001,
        sourceHeight: 1_000
      ) == nil,
      "Images beyond the source-dimension safety ceiling must still be rejected"
    )

    precondition(
      StaticImageLimits.acceptsFile(
        isRegularFile: true,
        isSymbolicLink: false,
        encodedBytes: 1_024
      )
    )
    precondition(
      !StaticImageLimits.acceptsFile(
        isRegularFile: false,
        isSymbolicLink: false,
        encodedBytes: 0
      ),
      "Special filesystem nodes must never reach ImageIO"
    )
    precondition(
      !StaticImageLimits.acceptsFile(
        isRegularFile: true,
        isSymbolicLink: true,
        encodedBytes: 1_024
      ),
      "Symbolic links must be rejected to avoid path/metadata races"
    )
    precondition(StaticImageLimits.acceptsDecoded(width: 2_309, height: 1_732))
    precondition(
      !StaticImageLimits.acceptsDecoded(width: 4_096, height: 4_096),
      "ImageIO output must satisfy the decoded pixel-count ceiling"
    )

    guard
      let roundingEdge = StaticImageDecodePlan.make(
        sourceWidth: 977,
        sourceHeight: 4_098
      )
    else {
      fatalError("A source within the documented limits must have a decode plan")
    }
    precondition(
      roundingEdge.thumbnailMaxPixelSize == 4_094,
      "The plan must reserve room for ImageIO rounding the secondary dimension up"
    )

    testImageIOBoundedDecode()
  }

  private static func testImageIOBoundedDecode() {
    let fixtureURL = FileManager.default.temporaryDirectory
      .appendingPathComponent("vcmlkit-static-image-\(UUID().uuidString).jpg")
    defer { try? FileManager.default.removeItem(at: fixtureURL) }

    let width = 4_032
    let height = 3_024
    guard
      let context = CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: width * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
      ),
      let fixtureImage = context.makeImage(),
      let destination = CGImageDestinationCreateWithURL(
        fixtureURL as CFURL,
        UTType.jpeg.identifier as CFString,
        1,
        nil
      )
    else {
      fatalError("Could not create the full-resolution ImageIO fixture")
    }

    CGImageDestinationAddImage(
      destination,
      fixtureImage,
      [
        kCGImageDestinationLossyCompressionQuality: 0.8,
        kCGImagePropertyOrientation: CGImagePropertyOrientation.right.rawValue,
      ] as CFDictionary
    )
    precondition(CGImageDestinationFinalize(destination))

    guard
      let source = CGImageSourceCreateWithURL(fixtureURL as CFURL, nil),
      let plan = StaticImageDecodePlan.make(sourceWidth: width, sourceHeight: height)
    else {
      fatalError("Could not read or plan the ImageIO fixture")
    }

    let commonOptions: [CFString: Any] = [
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceThumbnailMaxPixelSize: plan.thumbnailMaxPixelSize,
      kCGImageSourceShouldCacheImmediately: true,
    ]
    let transformedOptions = commonOptions.merging([
      kCGImageSourceCreateThumbnailWithTransform: true
    ]) { _, newValue in newValue }
    let untransformedOptions = commonOptions.merging([
      kCGImageSourceCreateThumbnailWithTransform: false
    ]) { _, newValue in newValue }

    guard
      let transformed = CGImageSourceCreateThumbnailAtIndex(
        source,
        0,
        transformedOptions as CFDictionary
      ),
      let untransformed = CGImageSourceCreateThumbnailAtIndex(
        source,
        0,
        untransformedOptions as CFDictionary
      )
    else {
      fatalError("ImageIO failed to perform the bounded thumbnail decode")
    }

    precondition(
      StaticImageLimits.acceptsDecoded(
        width: transformed.width,
        height: transformed.height
      )
    )
    precondition(
      (transformed.width, transformed.height) == (1_732, 2_309),
      "Embedded EXIF orientation must be applied exactly once; got \(transformed.width)x\(transformed.height)"
    )
    precondition(
      (untransformed.width, untransformed.height) == (2_309, 1_732),
      "Explicit orientation overrides require the raw thumbnail orientation; got \(untransformed.width)x\(untransformed.height)"
    )
  }
}
