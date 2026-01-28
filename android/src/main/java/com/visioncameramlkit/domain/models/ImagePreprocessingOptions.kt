package com.visioncameramlkit.domain.models

data class ImagePreprocessingOptions(
  val invertColors: Boolean = false,
  // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
  val outputOrientation: OutputOrientation? = null,
  val scaleFactor: Float = 1.0f,
  val orientation: Orientation = Orientation.PORTRAIT,
)
