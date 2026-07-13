package com.margelo.nitro.visioncameramlkit

import androidx.camera.core.ImageProxy
import androidx.core.graphics.scale
import com.google.mlkit.vision.common.InputImage
import com.margelo.nitro.camera.HybridFrameSpec
import com.margelo.nitro.camera.extensions.toBitmap
import com.margelo.nitro.camera.public.NativeFrame
import com.visioncameramlkit.domain.models.ImageMetadata
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.ProcessedImage
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor

internal fun HybridFrameSpec.toProcessedImage(
  imagePreprocessor: ImagePreprocessor,
  options: ImagePreprocessingOptions,
): ProcessedImage {
  val nativeFrame =
    this as? NativeFrame
      ?: throw IllegalArgumentException("Expected a VisionCamera native frame.")

  return imagePreprocessor.preprocessFrame(nativeFrame.image, this, options)
}

internal fun ImagePreprocessor.preprocessFrame(
  image: ImageProxy,
  frame: HybridFrameSpec,
  options: ImagePreprocessingOptions,
): ProcessedImage {
  val effectiveScale = options.scaleFactor.coerceIn(0.9f, 1.0f)
  val needsBitmapProcessing =
    options.invertColors ||
      effectiveScale < 1.0f ||
      frame.isMirrored ||
      options.roi != null

  if (!needsBitmapProcessing) {
    val mediaImage =
      image.image
        ?: throw UnsupportedOperationException("VisionCamera frame does not expose a media image.")

    val inputImage = InputImage.fromMediaImage(mediaImage, image.imageInfo.rotationDegrees)
    return ProcessedImage(
      image = inputImage,
      metadata =
        ImageMetadata(
          width = image.width,
          height = image.height,
          rotation = image.imageInfo.rotationDegrees,
          isInverted = false,
        ),
    )
  }

  val orientedBitmap = image.toBitmap(frame.orientation, frame.isMirrored)
  val (croppedBitmap, cropRect) = cropToRegionOfInterest(orientedBitmap, options.roi)

  val scaledBitmap =
    if (effectiveScale < 1.0f) {
      croppedBitmap.scale(
        (croppedBitmap.width * effectiveScale).toInt(),
        (croppedBitmap.height * effectiveScale).toInt(),
        false,
      )
    } else {
      croppedBitmap
    }

  val processedBitmap =
    if (options.invertColors) {
      invertBitmap(scaledBitmap)
    } else {
      scaledBitmap
    }

  return ProcessedImage(
    image = InputImage.fromBitmap(processedBitmap, 0),
    metadata =
      ImageMetadata(
        width = processedBitmap.width,
        height = processedBitmap.height,
        rotation = 0,
        isInverted = options.invertColors,
        offsetX = cropRect.left,
        offsetY = cropRect.top,
        scaleFactor = effectiveScale,
      ),
  )
}
