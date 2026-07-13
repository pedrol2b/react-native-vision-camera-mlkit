package com.visioncameramlkit.application.usecases

import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.TextRecognitionOptions
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.models.remap
import com.visioncameramlkit.domain.services.IImagePreprocessor
import com.visioncameramlkit.domain.services.IRecognitionService
import java.io.File

class RecognizeTextUseCase(
  private val imagePreprocessor: IImagePreprocessor,
  private val recognitionService: IRecognitionService<TextRecognitionResult>,
) {
  fun execute(
    imageFile: File,
    imageOptions: ImagePreprocessingOptions,
    @Suppress("unused") textOptions: TextRecognitionOptions,
  ): TextRecognitionResult {
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
