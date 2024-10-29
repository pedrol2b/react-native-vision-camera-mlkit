import Foundation
import MLKitVision
import VisionCamera

class VisionCameraMLkitUtils: NSObject {
  static func createVisionImageFromFrame(frame: Frame) -> VisionImage {
    let buffer: CMSampleBuffer = frame.buffer
    let image = VisionImage(buffer: buffer)

    // HACK: fix 'landscape' frame orientation
    image.orientation = fixLandscapeFrameOrientation(orientation: frame.orientation)
    return image
  }

  static func createInvertedVisionImageFromFrame(frame: Frame) -> VisionImage? {
    guard let buffer = CMSampleBufferGetImageBuffer(frame.buffer) else { return nil }
    let ciImage = CIImage(cvPixelBuffer: buffer)
    guard let invertedCIImage = invertCIImageColor(image: ciImage, orientation: frame.orientation)
    else { return nil }

    let image = VisionImage(image: invertedCIImage)

    // HACK: fix 'landscape' frame orientation
    image.orientation = fixLandscapeFrameOrientation(orientation: frame.orientation)
    return image
  }

  private static func fixLandscapeFrameOrientation(orientation: UIImage.Orientation)
    -> UIImage.Orientation
  {
    switch orientation {
    case .left:
      return .right
    case .right:
      return .left
    default:
      return orientation
    }
  }

  private static func invertCIImageColor(image: CIImage, orientation: UIImage.Orientation)
    -> UIImage?
  {
    guard let filter = CIFilter(name: "CIColorInvert") else { return nil }
    filter.setDefaults()
    filter.setValue(image, forKey: kCIInputImageKey)
    let context = CIContext(options: nil)

    guard let outputImage = filter.outputImage else { return nil }
    guard let outputImageCopy = context.createCGImage(outputImage, from: outputImage.extent) else {
      return nil
    }

    return UIImage(cgImage: outputImageCopy, scale: 1, orientation: orientation)
  }

  static func createBoundsMap(_ bounds: CGRect) -> [String: CGFloat] {
    let offsetX = (bounds.midX - ceil(bounds.width)) / 2.0
    let offsetY = (bounds.midY - ceil(bounds.height)) / 2.0

    let x = bounds.maxX + offsetX
    let y = bounds.minY + offsetY

    return [
      "x": bounds.midX + (bounds.midX - x),
      "y": bounds.midY + (y - bounds.midY),
      "centerX": bounds.midX,
      "centerY": bounds.midY,
      "width": bounds.width,
      "height": bounds.height,
      "top": bounds.maxY,
      "left": bounds.minX,
      "bottom": bounds.minY,
      "right": bounds.maxX,
    ]
  }

  private static func createCornerMap(_ corner: CGPoint) -> [String: Double] {
    return [
      "x": Double(corner.x),
      "y": Double(corner.y),
    ]
  }

  static func createCornersArray(_ corners: [NSValue]) -> [[String: Double]] {
    return corners.map { createCornerMap($0.cgPointValue) }
  }
}
