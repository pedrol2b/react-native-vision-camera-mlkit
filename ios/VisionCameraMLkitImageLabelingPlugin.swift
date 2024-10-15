import Foundation
import VisionCamera

enum VisionCameraMLkitImageLabelingError: Error {}

@objc(VisionCameraMLkitImageLabelingPlugin)
public class VisionCameraMLkitImageLabelingPlugin: FrameProcessorPlugin {
  @objc
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  func callback(_ frame: Frame, arguments: [AnyHashable: Any]?) -> Any {
    return [:]
  }
}
