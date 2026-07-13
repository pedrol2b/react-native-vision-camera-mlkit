package com.margelo.nitro.visioncameramlkit

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.BarcodeScanningServiceFactory

@DoNotStrip
@Keep
class HybridBarcodeScanner(
  private val options: BarcodeScannerOptions,
) : HybridBarcodeScannerSpec() {
  private val imagePreprocessor = ImagePreprocessor()
  private val barcodeOptions = options.toDomainBarcodeScanningOptions()
  private val imageOptions = options.toImagePreprocessingOptions()
  private val recognitionService = BarcodeScanningServiceFactory.create(barcodeOptions)

  override fun recognize(
    frame: HybridFrameSpec,
    args: MLKitBaseArguments?,
  ): BarcodeScannerResult {
    val processedImage = frame.toProcessedImage(imagePreprocessor, imageOptions)
    val result = recognitionService.recognize(processedImage)
    return result.remap(processedImage.metadata).toNitroResult()
  }
}
