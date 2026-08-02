package com.visioncameramlkit.domain.models

/**
 * Translates a coordinate produced against a processed (cropped and/or scaled) image
 * back into the original source image/frame's pixel space.
 *
 * Preprocessing crops first (in pre-scale pixel space), then scales. To invert that,
 * this first undoes the scale factor (dividing by it), then adds back the crop offset,
 * which was recorded in pre-scale pixel space: `source = offset + processed / scaleFactor`.
 */
private fun remapPoint(
  value: Double,
  offset: Int,
  scaleFactor: Float,
): Double = offset + value / scaleFactor

fun BoundingBox.remap(metadata: ImageMetadata): BoundingBox =
  BoundingBox(
    x = remapPoint(x, metadata.offsetX, metadata.scaleFactor),
    y = remapPoint(y, metadata.offsetY, metadata.scaleFactor),
    centerX = remapPoint(centerX, metadata.offsetX, metadata.scaleFactor),
    centerY = remapPoint(centerY, metadata.offsetY, metadata.scaleFactor),
    width = width / metadata.scaleFactor,
    height = height / metadata.scaleFactor,
    top = remapPoint(top, metadata.offsetY, metadata.scaleFactor),
    left = remapPoint(left, metadata.offsetX, metadata.scaleFactor),
    bottom = remapPoint(bottom, metadata.offsetY, metadata.scaleFactor),
    right = remapPoint(right, metadata.offsetX, metadata.scaleFactor),
  )

fun Corner.remap(metadata: ImageMetadata): Corner =
  Corner(
    x = remapPoint(x, metadata.offsetX, metadata.scaleFactor),
    y = remapPoint(y, metadata.offsetY, metadata.scaleFactor),
  )
