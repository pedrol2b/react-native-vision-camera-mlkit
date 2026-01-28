package com.visioncameramlkit.infrastructure.image

import android.graphics.Bitmap
import android.graphics.Bitmap.createBitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.media.Image
import androidx.core.graphics.scale
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.common.internal.ImageConvertUtils
import com.mrousavy.camera.frameprocessors.Frame
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

  override fun preprocessFrame(
    frame: Frame,
    options: ImagePreprocessingOptions,
  ): ProcessedImage {
    val effectiveScale = clampScale(options.scaleFactor)

    val inputImage =
      if (options.invertColors) {
        createInvertedInputImage(frame, effectiveScale)
      } else {
        createInputImage(frame, effectiveScale)
      }

    val metadata =
      ImageMetadata(
        width = (frame.imageProxy.width * effectiveScale).toInt(),
        height = (frame.imageProxy.height * effectiveScale).toInt(),
        rotation = frame.imageProxy.imageInfo.rotationDegrees,
        isInverted = options.invertColors,
      )

    return ProcessedImage(inputImage, metadata)
  }

  private fun createInputImage(
    frame: Frame,
    scaleFactor: Float,
  ): InputImage {
    val mediaImage: Image = frame.image

    val image = InputImage.fromMediaImage(mediaImage, frame.imageProxy.imageInfo.rotationDegrees)
    val frameBitmap = ImageConvertUtils.getInstance().getUpRightBitmap(image)

    val finalBitmap =
      if (scaleFactor < 1.0f) {
        frameBitmap.scale(
          (frameBitmap.width * scaleFactor).toInt(),
          (frameBitmap.height * scaleFactor).toInt(),
          false,
        )
      } else {
        frameBitmap
      }

    return InputImage.fromBitmap(finalBitmap, 0)
  }

  private fun createInvertedInputImage(
    frame: Frame,
    scaleFactor: Float,
  ): InputImage {
    val mediaImage: Image = frame.image

    val image = InputImage.fromMediaImage(mediaImage, frame.imageProxy.imageInfo.rotationDegrees)
    val frameBitmap = ImageConvertUtils.getInstance().getUpRightBitmap(image)

    // Scale first if needed
    val scaledBitmap =
      if (scaleFactor < 1.0f) {
        frameBitmap.scale(
          (frameBitmap.width * scaleFactor).toInt(),
          (frameBitmap.height * scaleFactor).toInt(),
          false,
        )
      } else {
        frameBitmap
      }

    // Then invert
    val invertedBitmap = invertBitmap(scaledBitmap)

    return InputImage.fromBitmap(invertedBitmap, 0)
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

    val rotatedBitmap = rotateBitmap(bitmap, options.orientation)
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
