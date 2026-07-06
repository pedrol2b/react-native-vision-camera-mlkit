package com.visioncameramlkit.infrastructure.image

import android.graphics.Bitmap
import android.graphics.Bitmap.createBitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import androidx.core.graphics.scale
import androidx.exifinterface.media.ExifInterface
import com.google.mlkit.vision.common.InputImage
import com.visioncameramlkit.domain.models.ImageMetadata
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.Orientation
import com.visioncameramlkit.domain.models.ProcessedImage
import com.visioncameramlkit.domain.services.IImagePreprocessor
import java.io.File

@Suppress("MagicNumber")
class ImagePreprocessor : IImagePreprocessor {
  // Clamp scaleFactor to safe range for ML accuracy
  private fun clampScale(scaleFactor: Float?): Float {
    val scale = scaleFactor ?: 1.0f
    return scale.coerceIn(0.9f, 1.0f)
  }

  private fun invertBitmap(bitmap: Bitmap): Bitmap =
    createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888).apply {
      val canvas = Canvas(this)
      val paint = Paint()

      val matrixGrayscale = ColorMatrix()
      matrixGrayscale.setSaturation(0f)

      val matrixInvert = ColorMatrix()
      matrixInvert.set(
        floatArrayOf(
          -1.0f,
          0.0f,
          0.0f,
          0.0f,
          255.0f,
          0.0f,
          -1.0f,
          0.0f,
          0.0f,
          255.0f,
          0.0f,
          0.0f,
          -1.0f,
          0.0f,
          255.0f,
          0.0f,
          0.0f,
          0.0f,
          1.0f,
          0.0f,
        ),
      )
      matrixInvert.preConcat(matrixGrayscale)

      val filter = ColorMatrixColorFilter(matrixInvert)
      paint.colorFilter = filter

      canvas.drawBitmap(bitmap, 0f, 0f, paint)
    }

  override fun preprocessImage(
    imageFile: File,
    options: ImagePreprocessingOptions,
  ): ProcessedImage {
    val bitmap =
      BitmapFactory.decodeFile(imageFile.absolutePath)
        ?: throw UnsupportedOperationException("Failed to decode image file")

    // Use the user-provided orientation override, or fall back to the image's
    // embedded EXIF orientation metadata.
    val effectiveOrientation = options.orientation ?: readExifOrientation(imageFile)

    val rotatedBitmap = rotateBitmap(bitmap, effectiveOrientation)
    val effectiveScale = clampScale(options.scaleFactor)

    val processedBitmap =
      if (options.invertColors) {
        val scaledBitmap =
          if (effectiveScale < 1.0f) {
            rotatedBitmap.scale(
              (rotatedBitmap.width * effectiveScale).toInt(),
              (rotatedBitmap.height * effectiveScale).toInt(),
              false,
            )
          } else {
            rotatedBitmap
          }
        invertBitmap(scaledBitmap)
      } else {
        if (effectiveScale < 1.0f) {
          rotatedBitmap.scale(
            (rotatedBitmap.width * effectiveScale).toInt(),
            (rotatedBitmap.height * effectiveScale).toInt(),
            false,
          )
        } else {
          rotatedBitmap
        }
      }

    val inputImage = InputImage.fromBitmap(processedBitmap, 0)

    val metadata =
      ImageMetadata(
        width = processedBitmap.width,
        height = processedBitmap.height,
        rotation = 0, // Static images are already oriented
        isInverted = options.invertColors,
      )

    return ProcessedImage(inputImage, metadata)
  }

  /**
   * Reads EXIF orientation from the image file and maps it to an [Orientation].
   * Falls back to [Orientation.PORTRAIT] if EXIF data is unavailable or unrecognized.
   */
  private fun readExifOrientation(imageFile: File): Orientation =
    try {
      val exif = ExifInterface(imageFile.absolutePath)
      when (exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
        ExifInterface.ORIENTATION_NORMAL,
        ExifInterface.ORIENTATION_FLIP_HORIZONTAL,
        -> Orientation.PORTRAIT

        ExifInterface.ORIENTATION_ROTATE_180,
        ExifInterface.ORIENTATION_FLIP_VERTICAL,
        -> Orientation.PORTRAIT_UPSIDE_DOWN

        ExifInterface.ORIENTATION_ROTATE_90,
        ExifInterface.ORIENTATION_TRANSPOSE,
        -> Orientation.LANDSCAPE_LEFT

        ExifInterface.ORIENTATION_ROTATE_270,
        ExifInterface.ORIENTATION_TRANSVERSE,
        -> Orientation.LANDSCAPE_RIGHT

        else -> Orientation.PORTRAIT
      }
    } catch (
      @Suppress("TooGenericExceptionCaught") e: Exception,
    ) {
      Orientation.PORTRAIT
    }

  private fun rotateBitmap(
    bitmap: Bitmap,
    orientation: Orientation,
  ): Bitmap {
    val matrix = Matrix()
    val degrees =
      when (orientation) {
        Orientation.PORTRAIT -> 0f
        Orientation.PORTRAIT_UPSIDE_DOWN -> 180f
        Orientation.LANDSCAPE_LEFT -> 90f
        Orientation.LANDSCAPE_RIGHT -> 270f
      }

    matrix.postRotate(degrees)
    return createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
  }
}
