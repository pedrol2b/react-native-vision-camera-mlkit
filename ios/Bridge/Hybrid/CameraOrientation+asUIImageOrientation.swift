import UIKit

extension CameraOrientation {
  var asUIImageOrientation: UIImage.Orientation {
    switch self {
    case .up:
      return .up
    case .right:
      return .right
    case .down:
      return .down
    case .left:
      return .left
    }
  }
}
