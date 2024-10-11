import Foundation
import MLKitVision
import VisionCamera

@objc(VisionCameraMLkitBarcodeScanningPlugin)
class VisionCameraMLkitBarcodeScanningPlugin: NSObject {
  func callback(frame: Frame, arguments: [String: Any]?) -> [String: Any] {}
}
