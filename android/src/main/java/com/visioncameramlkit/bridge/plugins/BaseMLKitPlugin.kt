package com.visioncameramlkit.bridge.plugins

import android.util.Log
import com.google.mlkit.common.MlKitException
import com.mrousavy.camera.core.FrameInvalidError
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

@Suppress("MagicNumber")
abstract class BaseMLKitPlugin(
  @Suppress("unused")
  protected val proxy: VisionCameraProxy,
  protected val options: Map<String, Any>?,
) : FrameProcessorPlugin() {
  protected abstract val tag: String

  private val frameProcessInterval: Int =
    (options?.get("frameProcessInterval") as? Number)?.toInt() ?: 0
  private var frameCounter: Int = 0
  protected val invertColors: Boolean = options?.get("invertColors") as? Boolean ?: false
  protected val scaleFactor: Float =
    (options?.get("scaleFactor") as? Number)?.toFloat()?.coerceIn(0.9f, 1.0f) ?: 1.0f

  // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
  protected val outputOrientation: com.visioncameramlkit.domain.models.OutputOrientation? =
    com.visioncameramlkit.domain.models.OutputOrientation
      .fromString(options?.get("outputOrientation") as? String)

  protected abstract fun processFrame(
    frame: Frame,
    arguments: Map<String, Any>?,
  ): HashMap<String, Any>

  override fun callback(
    frame: Frame,
    arguments: Map<String, Any>?,
  ): HashMap<String, Any> {
    // Process 1 frame, skip N frames, repeat
    // Note: Consider using runAtTargetFps() from Vision Camera instead
    if (frameProcessInterval > 0) {
      frameCounter++
      if (frameCounter <= frameProcessInterval) {
        return hashMapOf()
      }
      frameCounter = 0
    }

    return try {
      processFrame(frame, arguments)
    } catch (e: FrameInvalidError) {
      Log.e(tag, "FrameInvalidError occurred while processing the frame", e)
      hashMapOf()
    } catch (e: MlKitException) {
      Log.e(tag, "MlKitException occurred while processing the image with ML Kit", e)
      hashMapOf()
    } catch (
      @Suppress("TooGenericExceptionCaught") e: Exception,
    ) {
      Log.e(tag, "Unexpected error occurred during recognition", e)
      hashMapOf()
    }
  }
}
