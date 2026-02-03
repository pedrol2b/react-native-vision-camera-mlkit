package com.visioncameramlkit.bridge.plugins

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.application.usecases.RecognizeBarcodeUseCase
import com.visioncameramlkit.domain.models.BarcodeFormatOption
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

  private val barcodeOptions: BarcodeScanningOptions
  private val recognizeBarcodeUseCase: RecognizeBarcodeUseCase

  init {
    val formatStrings =
      (options?.get("formats") as? List<*>)
        ?.mapNotNull { it as? String }
        ?.map { it.uppercase() }
        ?: listOf("ALL")
    val parsedFormats = parseFormats(formatStrings)
    val enableAllPotentialBarcodes = options?.get("enableAllPotentialBarcodes") as? Boolean ?: false

    barcodeOptions =
      BarcodeScanningOptions(
        formats = parsedFormats,
        enableAllPotentialBarcodes = enableAllPotentialBarcodes,
        invertColors = invertColors,
        outputOrientation = outputOrientation,
        scaleFactor = scaleFactor,
      )

    val recognitionService = BarcodeScanningServiceFactory.create(barcodeOptions)
    val imagePreprocessor = ImagePreprocessor()
    recognizeBarcodeUseCase = RecognizeBarcodeUseCase(imagePreprocessor, recognitionService)
  }

  override fun processFrame(
    frame: Frame,
    arguments: Map<String, Any>?,
  ): HashMap<String, Any> {
    val result = recognizeBarcodeUseCase.execute(frame, barcodeOptions)
    return BarcodeScanningSerializer.toReactNativeMap(result)
  }

  private fun parseFormats(formatStrings: List<String>): List<BarcodeFormatOption> {
    val formats =
      formatStrings.mapNotNull { value ->
        try {
          BarcodeFormatOption.valueOf(value)
        } catch (
          @Suppress("SwallowedException") _: IllegalArgumentException,
        ) {
          null
        }
      }

    return formats.ifEmpty {
      listOf(BarcodeFormatOption.ALL)
    }
  }
}
