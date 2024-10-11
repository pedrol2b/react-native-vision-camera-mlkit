import Foundation
import MLKitVision
import UIKit
import VisionCamera

class VisionCameraMLkitUtils {

  static func createInputImage(from frame: Frame) -> VisionImage? {
    guard let buffer = frame.buffer else { return nil }
    let image = VisionImage(buffer: buffer)
    image.orientation = getFrameOrientation(frame.orientation)
    return image
  }

  static func createInvertedInputImage(from frame: Frame) -> VisionImage? {
    guard let inputImage = createInputImage(from: frame) else { return nil }
    guard let frameBitmap = inputImage.image else { return nil }

    let invertedBitmap = invertBitmap(frameBitmap)
    return VisionImage(image: invertedBitmap)
  }

  private static func invertBitmap(_ bitmap: UIImage) -> UIImage {
    guard let cgImage = bitmap.cgImage else { return bitmap }

    let context = CIContext(options: nil)
    let coreImage = CIImage(cgImage: cgImage)

    let filter = CIFilter(name: "CIColorInvert")
    filter?.setValue(coreImage, forKey: kCIInputImageKey)

    guard let outputImage = filter?.outputImage else { return bitmap }
    guard let cgOutputImage = context.createCGImage(outputImage, from: outputImage.extent) else {
      return bitmap
    }

    return UIImage(cgImage: cgOutputImage)
  }

  static func createBoundsMap(_ bounds: CGRect) -> [String: Any] {
    return [
      "x": bounds.midX,
      "y": bounds.midY,
      "centerX": bounds.midX,
      "centerY": bounds.midY,
      "width": bounds.width,
      "height": bounds.height,
      "top": bounds.minY,
      "left": bounds.minX,
      "bottom": bounds.maxY,
      "right": bounds.maxX,
    ]
  }

  private static func createCornerMap(_ corner: CGPoint) -> [String: Any] {
    return [
      "x": corner.x,
      "y": corner.y,
    ]
  }

  static func createCornersArray(_ corners: [CGPoint]) -> [[String: Any]] {
    return corners.map { createCornerMap($0) }
  }

  private static func getFrameOrientation(orientation: UIImage.Orientation) -> UIImage.Orientation {
    switch orientation {
    case .left:
      return .right
    case .right:
      return .left
    case .up, .down:
      return orientation
    default:
      return orientation
    }
  }
}
