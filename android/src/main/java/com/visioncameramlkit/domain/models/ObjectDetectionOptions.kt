package com.visioncameramlkit.domain.models

data class ObjectDetectionOptions(
  val detectorMode: ObjectDetectorModeOption = ObjectDetectorModeOption.STREAM,
  val shouldEnableMultipleObjects: Boolean = false,
  val shouldEnableClassification: Boolean = false,
  val invertColors: Boolean = false,
  // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
  val outputOrientation: OutputOrientation? = null,
  val scaleFactor: Float = 1.0f,
)

enum class ObjectDetectorModeOption {
  STREAM,
  SINGLE_IMAGE,
}
