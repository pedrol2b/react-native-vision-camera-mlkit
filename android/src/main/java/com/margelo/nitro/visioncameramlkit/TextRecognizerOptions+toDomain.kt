package com.margelo.nitro.visioncameramlkit

import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.TextRecognitionOptions

internal fun TextRecognizerOptions.toDomainTextRecognitionOptions(): TextRecognitionOptions =
  TextRecognitionOptions(
    language = language.toDomainLanguage(),
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
  )

internal fun TextRecognizerOptions.toImagePreprocessingOptions(): ImagePreprocessingOptions =
  ImagePreprocessingOptions(
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
    roi = roi.toDomainRegionOfInterest(),
  )
