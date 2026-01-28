package com.visioncameramlkit.bridge.plugins

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.application.usecases.RecognizeTextUseCase
import com.visioncameramlkit.domain.models.TextRecognitionLanguage
import com.visioncameramlkit.domain.models.TextRecognitionOptions
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.MLKitTextRecognitionService
import com.visioncameramlkit.infrastructure.mlkit.factories.TextRecognitionServiceFactory
import com.visioncameramlkit.infrastructure.serializers.TextRecognitionSerializer

@Suppress("unused")
class TextRecognitionPlugin(
  proxy: VisionCameraProxy,
  options: Map<String, Any>?,
) : BaseMLKitPlugin(proxy, options) {
  override val tag = "TextRecognitionPlugin"

  private val textRecognitionOptions: TextRecognitionOptions
  private val recognizeTextUseCase: RecognizeTextUseCase

  init {
    val languageString = options?.get("language") as? String ?: "LATIN"

    val language =
      try {
        TextRecognitionLanguage.valueOf(languageString)
      } catch (
        @Suppress("SwallowedException") _: IllegalArgumentException,
      ) {
        TextRecognitionLanguage.LATIN
      }

    textRecognitionOptions =
      TextRecognitionOptions(
        language = language,
        invertColors = invertColors,
        outputOrientation = outputOrientation,
        scaleFactor = scaleFactor,
      )

    val textRecognizer = TextRecognitionServiceFactory.createTextRecognizer(language)
    val recognitionService = MLKitTextRecognitionService(textRecognizer)
    val imagePreprocessor = ImagePreprocessor()

    recognizeTextUseCase = RecognizeTextUseCase(imagePreprocessor, recognitionService)
  }

  override fun processFrame(
    frame: Frame,
    arguments: Map<String, Any>?,
  ): HashMap<String, Any> {
    // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
    // val outputOrientation = arguments?.get("outputOrientation") as? String

    val result = recognizeTextUseCase.execute(frame, textRecognitionOptions)
    return TextRecognitionSerializer.toReactNativeMap(result)
  }
}
