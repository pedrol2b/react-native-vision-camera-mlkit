package com.visioncameramlkit.application.usecases

import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.domain.services.IImagePreprocessor
import com.visioncameramlkit.domain.services.IRecognitionService
import java.io.File

class RecognizeBarcodesUseCase(
  private val imagePreprocessor: IImagePreprocessor,
  private val recognitionService: IRecognitionService<BarcodeScanningResult>,
) {
  fun execute(
    imageFile: File,
    imageOptions: ImagePreprocessingOptions,
    @Suppress("unused") barcodeOptions: BarcodeScanningOptions,
  ): BarcodeScanningResult {
    val preprocessingOptions =
      ImagePreprocessingOptions(
        invertColors = imageOptions.invertColors,
        orientation = imageOptions.orientation,
        scaleFactor = imageOptions.scaleFactor,
        roi = imageOptions.roi,
      )

    val processedImage = imagePreprocessor.preprocessImage(imageFile, preprocessingOptions)
    val result = recognitionService.recognize(processedImage)
    return result.remap(processedImage.metadata)
  }
}
