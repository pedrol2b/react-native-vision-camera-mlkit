import Foundation
import MLKitVision
import VisionCamera

@objc(VisionCameraMLkitImageLabelingPlugin)
class VisionCameraMLkitImageLabelingPlugin: NSObject {
  func callback(frame: Frame, arguments: [String: Any]?) -> [String: Any] {}
}
