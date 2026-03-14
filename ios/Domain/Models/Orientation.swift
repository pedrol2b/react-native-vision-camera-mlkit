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

  /// Maps a UIImage.Orientation (typically from EXIF metadata) back to an Orientation value.
  public static func fromUIImageOrientation(_ imageOrientation: UIImage.Orientation) -> Orientation
  {
    switch imageOrientation {
    case .up: return .portrait
    case .down: return .portraitUpsideDown
    case .left: return .landscapeLeft
    case .right: return .landscapeRight
    default: return .portrait
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
