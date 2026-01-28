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
)
