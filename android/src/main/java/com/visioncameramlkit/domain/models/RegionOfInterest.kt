package com.visioncameramlkit.domain.models

import android.graphics.Rect

enum class RegionOfInterestUnit {
  NORMALIZED,
  PIXEL,
}

data class RegionOfInterest(
  val x: Float,
  val y: Float,
  val width: Float,
  val height: Float,
  val unit: RegionOfInterestUnit = RegionOfInterestUnit.NORMALIZED,
) {
  init {
    require(x >= 0 && y >= 0) {
      "Invalid RegionOfInterest: x and y must be >= 0 (got x=$x, y=$y)."
    }
    require(width > 0 && height > 0) {
      "Invalid RegionOfInterest: width and height must be > 0 (got width=$width, height=$height)."
    }
    if (unit == RegionOfInterestUnit.NORMALIZED) {
      require(x + width <= 1f && y + height <= 1f) {
        "Invalid RegionOfInterest: normalized x + width and y + height must be <= 1 " +
          "(got x=$x, width=$width, y=$y, height=$height)."
      }
    }
  }
}

/**
 * Resolves this [RegionOfInterest] into a pixel-space [Rect] for an image of the given
 * dimensions, clamping the result to stay within the image bounds.
 */
fun RegionOfInterest.resolveToPixelRect(
  imageWidth: Int,
  imageHeight: Int,
): Rect {
  val (px, py, pw, ph) =
    when (unit) {
      RegionOfInterestUnit.PIXEL -> {
        listOf(x, y, width, height)
      }

      RegionOfInterestUnit.NORMALIZED -> {
        listOf(x * imageWidth, y * imageHeight, width * imageWidth, height * imageHeight)
      }
    }

  val left = px.toInt().coerceIn(0, imageWidth)
  val top = py.toInt().coerceIn(0, imageHeight)
  val right = (px + pw).toInt().coerceIn(left, imageWidth)
  val bottom = (py + ph).toInt().coerceIn(top, imageHeight)
  return Rect(left, top, right, bottom)
}
