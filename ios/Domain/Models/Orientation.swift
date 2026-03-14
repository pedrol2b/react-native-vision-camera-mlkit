import Foundation

#if canImport(UIKit)
  import UIKit
  public typealias NativeImageOrientation = UIImage.Orientation
#else
  public enum NativeImageOrientation {
    case up
    case down
    case left
    case right
    case upMirrored
    case downMirrored
    case leftMirrored
    case rightMirrored
  }
#endif

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
  public static func fromUIImageOrientation(_ imageOrientation: NativeImageOrientation)
    -> Orientation
  {
    switch imageOrientation {
    case .up, .upMirrored: return .portrait
    case .down, .downMirrored: return .portraitUpsideDown
    case .left, .leftMirrored: return .landscapeLeft
    case .right, .rightMirrored: return .landscapeRight
    default: return .portrait
    }
  }

  public var asUIImageOrientation: NativeImageOrientation {
    switch self {
    case .portrait: return .up
    case .portraitUpsideDown: return .down
    case .landscapeLeft: return .left
    case .landscapeRight: return .right
    }
  }
}
