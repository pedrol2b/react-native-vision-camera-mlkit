import Foundation

#if canImport(VisionCamera)
  import VisionCamera

  @objc
  public class PluginRegistry: NSObject {

    @objc
    public static func registerTextRecognitionPlugin() {
      // Plugin registration is handled by the Objective-C bridge in VisionCameraMLKit.mm
      // This class exists for consistency with Android architecture
    }
  }
#endif
