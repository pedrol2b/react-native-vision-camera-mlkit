import Foundation
import NitroModules

final class HybridVisionCameraMLKit: HybridVisionCameraMLKitSpec {
  func isFeatureAvailable(feature: MLKitFeature) throws -> Bool {
    switch feature {
    case .textrecognition:
      #if MLKIT_TEXT_RECOGNITION_ANY
        return true
      #else
        return false
      #endif
    case .barcodescanning:
      #if MLKIT_BARCODE_SCANNING
        return true
      #else
        return false
      #endif
    case .facedetection:
      #if MLKIT_FACE_DETECTION
        return true
      #else
        return false
      #endif
    case .posedetection:
      #if MLKIT_POSE_DETECTION
        return true
      #else
        return false
      #endif
    case .selfiesegmentation:
      #if MLKIT_SELFIE_SEGMENTATION
        return true
      #else
        return false
      #endif
    case .imagelabeling:
      #if MLKIT_IMAGE_LABELING
        return true
      #else
        return false
      #endif
    case .objectdetection:
      #if MLKIT_OBJECT_DETECTION
        return true
      #else
        return false
      #endif
    case .digitalinkrecognition:
      #if MLKIT_DIGITAL_INK_RECOGNITION
        return true
      #else
        return false
      #endif
    case .facemeshdetection, .subjectsegmentation, .documentscanner:
      return false
    }
  }

  func createTextRecognizer(options: TextRecognizerOptions) throws -> any HybridTextRecognizerSpec {
    guard try isFeatureAvailable(feature: .textrecognition) else {
      throw RuntimeError.error(withMessage: "TextRecognition is not enabled in the native ML Kit configuration.")
    }

    return HybridTextRecognizer(options: options)
  }

  func createBarcodeScanner(options: BarcodeScannerOptions) throws -> any HybridBarcodeScannerSpec {
    guard try isFeatureAvailable(feature: .barcodescanning) else {
      throw RuntimeError.error(withMessage: "BarcodeScanning is not enabled in the native ML Kit configuration.")
    }

    return HybridBarcodeScanner(options: options)
  }
}
