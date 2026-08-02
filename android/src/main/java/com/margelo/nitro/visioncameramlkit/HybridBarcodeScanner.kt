package com.margelo.nitro.visioncameramlkit

import android.util.Log
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec
import com.margelo.nitro.core.Promise
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.BarcodeScanningServiceFactory
import java.util.concurrent.atomic.AtomicBoolean

@DoNotStrip
@Keep
class HybridBarcodeScanner(
  private val options: BarcodeScannerOptions,
) : HybridBarcodeScannerSpec() {
  private val imagePreprocessor = ImagePreprocessor()
  private val barcodeOptions = options.toDomainBarcodeScanningOptions()
  private val imageOptions = options.toImagePreprocessingOptions()
  private val recognitionService = BarcodeScanningServiceFactory.create(barcodeOptions)
  private val isDisposed = AtomicBoolean(false)

  override fun recognize(
    frame: HybridFrameSpec,
    args: MLKitBaseArguments?,
  ): BarcodeScannerResult {
    val processedImage = frame.toProcessedImage(imagePreprocessor, imageOptions)
    val result = recognitionService.recognize(processedImage)
    return result.remap(processedImage.metadata).toNitroResult()
  }

  override fun recognizeImage(uri: String): Promise<BarcodeScannerResult> =
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
        .onFailure { error -> Log.w(TAG, "Failed to close barcode scanner", error) }
    }
    super.dispose()
  }
}
