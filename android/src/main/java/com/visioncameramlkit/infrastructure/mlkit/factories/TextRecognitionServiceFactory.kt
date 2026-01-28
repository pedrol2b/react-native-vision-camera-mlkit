package com.visioncameramlkit.infrastructure.mlkit.factories

import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.TextRecognizer
import com.google.mlkit.vision.text.chinese.ChineseTextRecognizerOptions
import com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions
import com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions
import com.google.mlkit.vision.text.korean.KoreanTextRecognizerOptions
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.visioncameramlkit.domain.models.TextRecognitionLanguage
import com.visioncameramlkit.infrastructure.mlkit.MLKitTextRecognitionService

object TextRecognitionServiceFactory {
  fun createTextRecognizer(language: TextRecognitionLanguage): TextRecognizer {
    val options =
      when (language) {
        TextRecognitionLanguage.LATIN -> TextRecognizerOptions.DEFAULT_OPTIONS
        TextRecognitionLanguage.CHINESE -> ChineseTextRecognizerOptions.Builder().build()
        TextRecognitionLanguage.DEVANAGARI -> DevanagariTextRecognizerOptions.Builder().build()
        TextRecognitionLanguage.JAPANESE -> JapaneseTextRecognizerOptions.Builder().build()
        TextRecognitionLanguage.KOREAN -> KoreanTextRecognizerOptions.Builder().build()
      }

    return TextRecognition.getClient(options)
  }

  fun create(language: TextRecognitionLanguage = TextRecognitionLanguage.LATIN): MLKitTextRecognitionService {
    val textRecognizer = createTextRecognizer(language)
    return MLKitTextRecognitionService(textRecognizer)
  }
}
