import Foundation
import MLKitVision
import VisionCamera

@objc(VisionCameraMLkitObjectDetectionPlugin)
class VisionCameraMLkitObjectDetectionPlugin: NSObject {
  func callback(frame: Frame, arguments: [String: Any]?) -> [String: Any] {}
}
