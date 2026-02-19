import Foundation

@objc public enum Orientation: Int {
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
    case .portrait: return .up
    case .portraitUpsideDown: return .down
    case .landscapeLeft: return .left
    case .landscapeRight: return .right
    }
  }
}
