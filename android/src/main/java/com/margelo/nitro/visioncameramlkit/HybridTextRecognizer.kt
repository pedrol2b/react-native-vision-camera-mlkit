package com.margelo.nitro.visioncameramlkit

import android.util.Log
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec
import com.margelo.nitro.core.Promise
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.TextRecognitionServiceFactory
import java.util.concurrent.atomic.AtomicBoolean

@DoNotStrip
@Keep
class HybridTextRecognizer(
  private val options: TextRecognizerOptions,
) : HybridTextRecognizerSpec() {
  private val imagePreprocessor = ImagePreprocessor()
  private val textOptions = options.toDomainTextRecognitionOptions()
  private val imageOptions = options.toImagePreprocessingOptions()
  private val recognitionService = TextRecognitionServiceFactory.create(textOptions.language)
  private val isDisposed = AtomicBoolean(false)

  override fun recognize(
    frame: HybridFrameSpec,
    args: MLKitBaseArguments?,
  ): TextRecognitionResult {
    val processedImage = frame.toProcessedImage(imagePreprocessor, imageOptions)
    val result = recognitionService.recognize(processedImage)
    return result.remap(processedImage.metadata).toNitroResult()
  }

  override fun recognizeImage(uri: String): Promise<TextRecognitionResult> =
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
        .onFailure { error -> Log.w(TAG, "Failed to close text recognizer", error) }
    }
    super.dispose()
  }
}
