import Foundation

import UIKit

enum DomainOrientation: Int {
  case portrait
  case portraitUpsideDown
  case landscapeLeft
  case landscapeRight

  init?(string: String?) {
    switch string {
    case "portrait": self = .portrait
    case "portrait-upside-down": self = .portraitUpsideDown
    case "landscape-left": self = .landscapeLeft
    case "landscape-right": self = .landscapeRight
    default: return nil
    }
  }

  /// Maps a UIImage.Orientation (typically from EXIF metadata) back to a DomainOrientation value.
  static func fromUIImageOrientation(_ imageOrientation: UIImage.Orientation)
    -> DomainOrientation
  {
    switch imageOrientation {
    case .up, .upMirrored: return .portrait
    case .down, .downMirrored: return .portraitUpsideDown
    case .left, .leftMirrored: return .landscapeLeft
    case .right, .rightMirrored: return .landscapeRight
    default: return .portrait
    }
  }

  var asUIImageOrientation: UIImage.Orientation {
    switch self {
    case .portrait: return .up
    case .portraitUpsideDown: return .down
    case .landscapeLeft: return .left
    case .landscapeRight: return .right
    }
  }
}
