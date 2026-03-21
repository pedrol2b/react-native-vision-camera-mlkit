package com.visioncameramlkit.bridge.plugins

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.application.usecases.RecognizeBarcodesUseCase
import com.visioncameramlkit.bridge.parsers.BarcodeScanningOptionParser
import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.BarcodeScanningServiceFactory
import com.visioncameramlkit.infrastructure.serializers.BarcodeScanningSerializer

@Suppress("unused")
class BarcodeScanningPlugin(
  proxy: VisionCameraProxy,
  options: Map<String, Any>?,
) : BaseMLKitPlugin(proxy, options) {
  override val tag = "BarcodeScanningPlugin"

  private val barcodeScanningOptions: BarcodeScanningOptions =
    BarcodeScanningOptions(
      formats = BarcodeScanningOptionParser.parseFormats(options?.get("formats")),
      enableAllPotentialBarcodes =
        BarcodeScanningOptionParser.parseEnableAllPotentialBarcodes(
          options?.get("enableAllPotentialBarcodes"),
        ),
      invertColors = invertColors,
      outputOrientation = outputOrientation,
      scaleFactor = scaleFactor,
    )
  private val recognizeBarcodesUseCase: RecognizeBarcodesUseCase

  init {

    val recognitionService = BarcodeScanningServiceFactory.create(barcodeScanningOptions)
    val imagePreprocessor = ImagePreprocessor()

    recognizeBarcodesUseCase = RecognizeBarcodesUseCase(imagePreprocessor, recognitionService)
  }

  override fun processFrame(
    frame: Frame,
    arguments: Map<String, Any>?,
  ): HashMap<String, Any> {
    val result = recognizeBarcodesUseCase.execute(frame, barcodeScanningOptions)
    return BarcodeScanningSerializer.toReactNativeMap(result)
  }
}
