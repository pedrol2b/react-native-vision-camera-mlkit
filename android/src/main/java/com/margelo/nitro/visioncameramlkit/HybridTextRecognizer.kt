package com.margelo.nitro.visioncameramlkit

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.TextRecognitionServiceFactory

@DoNotStrip
@Keep
class HybridTextRecognizer(
  private val options: TextRecognizerOptions,
) : HybridTextRecognizerSpec() {
  private val imagePreprocessor = ImagePreprocessor()
  private val textOptions = options.toDomainTextRecognitionOptions()
  private val imageOptions = options.toImagePreprocessingOptions()
  private val recognitionService = TextRecognitionServiceFactory.create(textOptions.language)

  override fun recognize(frame: HybridFrameSpec, args: MLKitBaseArguments?): TextRecognitionResult {
    val processedImage = frame.toProcessedImage(imagePreprocessor, imageOptions)
    return recognitionService.recognize(processedImage).toNitroResult()
  }
}
