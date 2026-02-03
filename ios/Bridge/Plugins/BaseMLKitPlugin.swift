import Foundation

#if canImport(VisionCamera)
  import VisionCamera

  @objc
  public class BaseMLKitPlugin: FrameProcessorPlugin {

    let proxy: VisionCameraProxyHolder
    let options: [AnyHashable: Any]?

    private let frameProcessInterval: Int
    private var frameCounter: Int = 0
    let invertColors: Bool
    let scaleFactor: CGFloat

    var outputOrientation: OutputOrientation?

    public override init(
      proxy: VisionCameraProxyHolder,
      options: [AnyHashable: Any]?
    ) {
      self.proxy = proxy
      self.options = options
      self.frameProcessInterval = options?["frameProcessInterval"] as? Int ?? 0
      self.invertColors = options?["invertColors"] as? Bool ?? false

      let sf = options?["scaleFactor"] as? NSNumber
      let sfValue = sf?.doubleValue ?? 1.0

      self.scaleFactor = min(max(CGFloat(sfValue), 0.9), 1.0)

      super.init(proxy: proxy, options: options)
    }

    public override func callback(
      _ frame: Frame,
      withArguments arguments: [AnyHashable: Any]?
    ) -> Any {
      // Extract outputOrientation from arguments for rotation support
      outputOrientation = OutputOrientation(
        string: arguments?["outputOrientation"] as? String
      )

      // Process 1 frame, skip N frames, repeat
      // Note: Consider using runAtTargetFps() from Vision Camera instead
      if frameProcessInterval > 0 {
        frameCounter += 1
        if frameCounter <= frameProcessInterval {
          return [:]
        }
        frameCounter = 0
      }

      do {
        return try processFrame(frame, withArguments: arguments)
      } catch {
        print("[\(pluginName)] Error occurred: \(error.localizedDescription)")
        return [:]
      }
    }

    public func processFrame(
      _ frame: Frame,
      withArguments arguments: [AnyHashable: Any]?
    ) throws -> [String: Any] {
      fatalError("processFrame must be overridden by subclass")
    }

    var pluginName: String {
      return String(describing: type(of: self))
    }
  }
#endif
