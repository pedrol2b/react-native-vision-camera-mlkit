package com.visioncameramlkit.infrastructure.mlkit.factories

import com.visioncameramlkit.domain.models.TextRecognitionLanguage
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.services.IRecognitionService

object TextRecognitionServiceFactory {
  fun create(language: TextRecognitionLanguage = TextRecognitionLanguage.LATIN): IRecognitionService<TextRecognitionResult> =
    throw IllegalStateException(
      "Text recognition is not enabled in this build. Enable textRecognition (or a language " +
        "variant) in your MLKit configuration to use this feature.",
    )
}
