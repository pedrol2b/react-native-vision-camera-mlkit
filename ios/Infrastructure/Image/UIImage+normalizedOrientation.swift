import UIKit

extension UIImage {
  func normalized(to orientation: UIImage.Orientation) -> UIImage? {
    guard let cgImage else {
      return nil
    }

    // `.up` means the pixel data already matches the desired visual orientation,
    // so there's nothing to bake in — skip the redundant render pass.
    if orientation == .up {
      return UIImage(cgImage: cgImage, scale: 1, orientation: .up)
    }

    let swapsDimensions: Bool
    switch orientation {
    case .left, .leftMirrored, .right, .rightMirrored:
      swapsDimensions = true
    default:
      swapsDimensions = false
    }

    let pixelSize = CGSize(
      width: swapsDimensions ? cgImage.height : cgImage.width,
      height: swapsDimensions ? cgImage.width : cgImage.height
    )
    let orientedImage = UIImage(cgImage: cgImage, scale: 1, orientation: orientation)
    let rendererFormat = UIGraphicsImageRendererFormat.default()
    rendererFormat.scale = 1
    let renderer = UIGraphicsImageRenderer(size: pixelSize, format: rendererFormat)

    return renderer.image { _ in
      orientedImage.draw(in: CGRect(origin: .zero, size: pixelSize))
    }
  }
}
