import UIKit

@objc public enum OutputOrientation: Int {
  case portrait
  case portraitUpsideDown
  case landscapeLeft
  case landscapeRight

  public init?(string: String?) {
    switch string {
    case "portrait": self = .portrait
    case "portrait-upside-down": self = .portraitUpsideDown
    case "landscape-left": self = .landscapeLeft
    case "landscape-right": self = .landscapeRight
    default: return nil
    }
  }

  public var asUIImageOrientation: UIImage.Orientation {
    switch self {
    case .portrait: return .right
    case .portraitUpsideDown: return .left
    case .landscapeLeft: return .down
    case .landscapeRight: return .up
    }
  }
}
