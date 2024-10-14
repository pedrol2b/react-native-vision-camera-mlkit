import Foundation
import VisionCamera

enum VisionCameraMLkitBarcodeScanningError: Error {}

@objc(VisionCameraMLkitBarcodeScanningPlugin)
public class VisionCameraMLkitBarcodeScanningPlugin: FrameProcessorPlugin {
  override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  func callback(_ frame: Frame, arguments: [AnyHashable: Any]?) -> Any {
    return [:]
  }
}
