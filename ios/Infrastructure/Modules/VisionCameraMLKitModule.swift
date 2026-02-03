import Foundation
import React

@objc(VisionCameraMLKitModule)
class VisionCameraMLKitModule: NSObject {
  private lazy var handlers: [String: IStaticImageHandler] = {
    var handlers: [String: IStaticImageHandler] = [:]

    #if MLKIT_TEXT_RECOGNITION
      handlers[MLKitFeatureKeys.TEXT_RECOGNITION] = StaticTextRecognitionHandler()
    #endif

    #if MLKIT_BARCODE_SCANNING
      handlers[MLKitFeatureKeys.BARCODE_SCANNING] = StaticBarcodeScanningHandler()
    #endif

    return handlers
  }()

  @objc
  func processImage(
    _ feature: String,
    path: String,
    options: Any?,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let safeOptions = options as? [String: Any] ?? [:]
    guard let handler = handlers[feature] else {
      reject("UNSUPPORTED_FEATURE", "Feature \(feature) is not supported", nil)
      return
    }

    handler.process(
      path: path,
      options: safeOptions,
      resolver: { result in resolve(result) },
      rejecter: { code, message, error in reject(code, message, error) }
    )
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }
}
