package com.margelo.nitro.visioncameramlkit

import android.util.Log
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec
import com.margelo.nitro.core.Promise
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.ObjectDetectionServiceFactory
import java.util.concurrent.atomic.AtomicBoolean

@DoNotStrip
@Keep
class HybridObjectDetector(
  private val options: ObjectDetectorOptions,
) : HybridObjectDetectorSpec() {
  private val imagePreprocessor = ImagePreprocessor()
  private val detectionOptions = options.toDomainObjectDetectionOptions()
  private val imageOptions = options.toImagePreprocessingOptions()
  private val recognitionService = ObjectDetectionServiceFactory.create(detectionOptions)
  private val isDisposed = AtomicBoolean(false)

  override fun detect(
    frame: HybridFrameSpec,
    args: MLKitBaseArguments?,
  ): ObjectDetectionResult {
    val processedImage = frame.toProcessedImage(imagePreprocessor, imageOptions)
    val result = recognitionService.recognize(processedImage)
    return result.remap(processedImage.metadata).toNitroResult()
  }

  override fun detectImage(uri: String): Promise<ObjectDetectionResult> =
    Promise.parallel {
      StaticImageUriResolver.resolve(uri).use { resolvedImage ->
        val processedImage = imagePreprocessor.preprocessImage(resolvedImage.file, imageOptions)
        val result = recognitionService.recognize(processedImage)
        result.remap(processedImage.metadata).toNitroResult()
      }
    }

  override fun dispose() {
    if (isDisposed.compareAndSet(false, true)) {
      runCatching { recognitionService.close() }
        .onFailure { error -> Log.w(TAG, "Failed to close object detector", error) }
    }
    super.dispose()
  }
}
