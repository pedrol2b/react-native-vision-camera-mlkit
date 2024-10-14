import Foundation
import VisionCamera

enum VisionCameraMLkitObjectDetectionError: Error {}

@objc(VisionCameraMLkitObjectDetectionPlugin)
public class VisionCameraMLkitObjectDetectionPlugin: FrameProcessorPlugin {
  override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  func callback(_ frame: Frame, arguments: [AnyHashable: Any]?) -> Any {
    return [:]
  }
}
