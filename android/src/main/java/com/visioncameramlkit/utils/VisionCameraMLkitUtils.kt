package com.visioncameramlkit.utils

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.graphics.Point
import android.graphics.Rect
import android.media.Image
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.common.internal.ImageConvertUtils
import com.mrousavy.camera.frameprocessors.Frame

object VisionCameraMLkitUtils {
    fun createInputImageFromFrame(frame: Frame): InputImage {
        val mediaImage: Image = frame.image
        return InputImage.fromMediaImage(mediaImage, frame.imageProxy.imageInfo.rotationDegrees)
    }

    fun createInvertedInputImageFromFrame(frame: Frame): InputImage {
        val frameInputImage = createInputImageFromFrame(frame)
        val frameBitmap = ImageConvertUtils.getInstance().getUpRightBitmap(frameInputImage)

        val invertedBitmap = invertBitmap(frameBitmap)
        return InputImage.fromBitmap(invertedBitmap, 0)
    }

    /**
     * Inverts the colors of a given Bitmap.
     *
     * This function creates a new Bitmap with the same dimensions as the input Bitmap,
     * and then draws the input Bitmap onto the new Bitmap using a Paint object with a
     * color filter that inverts colors. The color inversion is achieved by setting a
     * negative scale of -1 for the red, green, and blue color channels, and then shifting
     * them by 255 (which is the maximum value for an 8-bit color channel).
     *
     * @param bitmap The input Bitmap to be inverted.
     * @return A new Bitmap which is an inverted version of the input Bitmap.
     */
    private fun invertBitmap(bitmap: Bitmap): Bitmap {
        return Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888).apply {
            val canvas = Canvas(this)
            val paint = Paint()

            val matrixGrayscale = ColorMatrix()
            matrixGrayscale.setSaturation(0f)

            val matrixInvert = ColorMatrix()
            matrixInvert.set(
                @Suppress("MagicNumber")
                floatArrayOf(
                    -1.0f, 0.0f, 0.0f, 0.0f, 255.0f,
                    0.0f, -1.0f, 0.0f, 0.0f, 255.0f,
                    0.0f, 0.0f, -1.0f, 0.0f, 255.0f,
                    0.0f, 0.0f, 0.0f, 1.0f, 0.0f
                )
            )
            matrixInvert.preConcat(matrixGrayscale)

            val filter = ColorMatrixColorFilter(matrixInvert)
            paint.setColorFilter(filter)

            canvas.drawBitmap(bitmap, 0f, 0f, paint)
        }
    }

    fun <K, V> Map<K, V>.getReversedMap(): Map<V, K> {
        return this.entries.associateBy({ it.value }) { it.key }
    }

    fun createBoundsMap(bounds: Rect): WritableNativeMap {
        return WritableNativeMap().apply {
            putDouble("x", bounds.exactCenterX().toDouble())
            putDouble("y", bounds.exactCenterY().toDouble())
            putInt("centerX", bounds.centerX())
            putInt("centerY", bounds.centerY())
            putInt("width", bounds.width())
            putInt("height", bounds.height())
            putInt("top", bounds.top)
            putInt("left", bounds.left)
            putInt("bottom", bounds.bottom)
            putInt("right", bounds.right)
        }
    }

    private fun createCornerMap(corner: Point): WritableNativeMap {
        return WritableNativeMap().apply {
            putInt("x", corner.x)
            putInt("y", corner.y)
        }
    }

    fun createCornersArray(corners: Array<Point>): WritableNativeArray {
        return WritableNativeArray().apply {
            for (corner in corners) {
                pushMap(createCornerMap(corner))
            }
        }
    }
}
