package com.visioncameramlkit.application.usecases

import com.mrousavy.camera.frameprocessors.Frame
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.TextRecognitionOptions
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.services.IImagePreprocessor
import com.visioncameramlkit.domain.services.IRecognitionService
import java.io.File

class RecognizeTextUseCase(
  private val imagePreprocessor: IImagePreprocessor,
  private val recognitionService: IRecognitionService<TextRecognitionResult>,
) {
  fun execute(
    frame: Frame,
    options: TextRecognitionOptions,
  ): TextRecognitionResult {
    val preprocessingOptions =
      ImagePreprocessingOptions(
        invertColors = options.invertColors,
        outputOrientation = options.outputOrientation,
        scaleFactor = options.scaleFactor,
      )

    val processedImage = imagePreprocessor.preprocessFrame(frame, preprocessingOptions)
    return recognitionService.recognize(processedImage)
  }

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
      )

    val processedImage = imagePreprocessor.preprocessImage(imageFile, preprocessingOptions)
    return recognitionService.recognize(processedImage)
  }
}
