package com.visioncameramlkit.domain.models

import com.google.mlkit.vision.common.InputImage

data class ProcessedImage(
  val image: InputImage,
  val metadata: ImageMetadata,
)

data class ImageMetadata(
  val width: Int,
  val height: Int,
  val rotation: Int,
  val isInverted: Boolean,
  // Crop origin (in post-rotation, pre-scale pixel space) applied by an ROI, if any.
  // Downstream result remapping adds this back onto ML Kit's result coordinates.
  val offsetX: Int = 0,
  val offsetY: Int = 0,
  // Scale factor applied during preprocessing, needed to unscale result coordinates
  // back to source image/frame pixel space.
  val scaleFactor: Float = 1.0f,
)
