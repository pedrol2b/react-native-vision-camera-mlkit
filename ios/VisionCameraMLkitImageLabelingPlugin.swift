import Foundation
import VisionCamera

enum VisionCameraMLkitImageLabelingError: Error {}

@objc(VisionCameraMLkitImageLabelingPlugin)
public class VisionCameraMLkitImageLabelingPlugin: FrameProcessorPlugin {
  @objc
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any
  {
    return [:]
  }
}
