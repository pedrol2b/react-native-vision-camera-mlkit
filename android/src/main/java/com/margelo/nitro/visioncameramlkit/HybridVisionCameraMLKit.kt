package com.margelo.nitro.visioncameramlkit

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.visioncameramlkit.BuildConfig

@DoNotStrip
@Keep
class HybridVisionCameraMLKit : HybridVisionCameraMLKitSpec() {
  override fun isFeatureAvailable(feature: MLKitFeature): Boolean =
    when (feature) {
      MLKitFeature.TEXTRECOGNITION -> BuildConfig.MLKIT_TEXT_RECOGNITION_ANY
      MLKitFeature.BARCODESCANNING -> BuildConfig.MLKIT_BARCODE_SCANNING
      MLKitFeature.FACEDETECTION -> BuildConfig.MLKIT_FACE_DETECTION
      MLKitFeature.FACEMESHDETECTION -> BuildConfig.MLKIT_FACE_MESH_DETECTION
      MLKitFeature.POSEDETECTION -> BuildConfig.MLKIT_POSE_DETECTION
      MLKitFeature.SELFIESEGMENTATION -> BuildConfig.MLKIT_SELFIE_SEGMENTATION
      MLKitFeature.SUBJECTSEGMENTATION -> BuildConfig.MLKIT_SUBJECT_SEGMENTATION
      MLKitFeature.DOCUMENTSCANNER -> BuildConfig.MLKIT_DOCUMENT_SCANNER
      MLKitFeature.IMAGELABELING -> BuildConfig.MLKIT_IMAGE_LABELING
      MLKitFeature.OBJECTDETECTION -> BuildConfig.MLKIT_OBJECT_DETECTION
      MLKitFeature.DIGITALINKRECOGNITION -> BuildConfig.MLKIT_DIGITAL_INK_RECOGNITION
    }

  override fun createTextRecognizer(options: TextRecognizerOptions): HybridTextRecognizerSpec {
    if (!isFeatureAvailable(MLKitFeature.TEXTRECOGNITION)) {
      throw Error("TextRecognition is not enabled in the native ML Kit configuration.")
    }

    return HybridTextRecognizer(options)
  }

  override fun createBarcodeScanner(options: BarcodeScannerOptions): HybridBarcodeScannerSpec {
    if (!isFeatureAvailable(MLKitFeature.BARCODESCANNING)) {
      throw Error("BarcodeScanning is not enabled in the native ML Kit configuration.")
    }

    return HybridBarcodeScanner(options)
  }
}
