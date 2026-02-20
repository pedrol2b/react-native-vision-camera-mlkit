package com.visioncameramlkit.infrastructure.mlkit.factories

import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.TextRecognizer
import com.google.mlkit.vision.text.TextRecognizerOptionsInterface
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.visioncameramlkit.BuildConfig
import com.visioncameramlkit.domain.models.TextRecognitionLanguage
import com.visioncameramlkit.infrastructure.mlkit.MLKitTextRecognitionService

object TextRecognitionServiceFactory {
  @Suppress("LongMethod", "ThrowsCount")
  fun createTextRecognizer(language: TextRecognitionLanguage): TextRecognizer {
    val options: TextRecognizerOptionsInterface =
      when (language) {
        TextRecognitionLanguage.LATIN -> {
          @Suppress("KotlinConstantConditions")
          if (!BuildConfig.MLKIT_TEXT_RECOGNITION) {
            throw IllegalStateException(
              "Text recognition for Latin is not enabled. " +
                "Set textRecognition to true in your MLKit configuration.",
            )
          }
          TextRecognizerOptions.DEFAULT_OPTIONS
        }

        TextRecognitionLanguage.CHINESE -> {
          @Suppress("KotlinConstantConditions")
          if (!BuildConfig.MLKIT_TEXT_RECOGNITION_CHINESE) {
            throw IllegalStateException(
              "Text recognition for Chinese is not enabled. " +
                "Set textRecognitionChinese to true in your MLKit configuration.",
            )
          }
          createOptionsViaReflection(
            "com.google.mlkit.vision.text.chinese.ChineseTextRecognizerOptions",
          )
        }

        TextRecognitionLanguage.DEVANAGARI -> {
          @Suppress("KotlinConstantConditions")
          if (!BuildConfig.MLKIT_TEXT_RECOGNITION_DEVANAGARI) {
            throw IllegalStateException(
              "Text recognition for Devanagari is not enabled. " +
                "Set textRecognitionDevanagari to true in your MLKit configuration.",
            )
          }
          createOptionsViaReflection(
            "com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions",
          )
        }

        TextRecognitionLanguage.JAPANESE -> {
          @Suppress("KotlinConstantConditions")
          if (!BuildConfig.MLKIT_TEXT_RECOGNITION_JAPANESE) {
            throw IllegalStateException(
              "Text recognition for Japanese is not enabled. " +
                "Set textRecognitionJapanese to true in your MLKit configuration.",
            )
          }
          createOptionsViaReflection(
            "com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions",
          )
        }

        TextRecognitionLanguage.KOREAN -> {
          @Suppress("KotlinConstantConditions")
          if (!BuildConfig.MLKIT_TEXT_RECOGNITION_KOREAN) {
            throw IllegalStateException(
              "Text recognition for Korean is not enabled. " +
                "Set textRecognitionKorean to true in your MLKit configuration.",
            )
          }
          createOptionsViaReflection(
            "com.google.mlkit.vision.text.korean.KoreanTextRecognizerOptions",
          )
        }
      }

    return TextRecognition.getClient(options)
  }

  /**
   * Creates language-specific TextRecognizerOptions via reflection to avoid hard
   * class dependencies on variant modules that may not be included in the build.
   * Each variant options class follows the Builder pattern: OptionsClass.Builder().build()
   */
  private fun createOptionsViaReflection(className: String): TextRecognizerOptionsInterface {
    try {
      val builderClass = Class.forName("$className\$Builder")
      val builder = builderClass.getDeclaredConstructor().newInstance()
      val buildMethod = builderClass.getMethod("build")
      return buildMethod.invoke(builder) as TextRecognizerOptionsInterface
    } catch (e: ClassNotFoundException) {
      throw IllegalStateException(
        "MLKit class $className not found. " +
          "Ensure the corresponding text recognition dependency is included.",
        e,
      )
    }
  }

  fun create(language: TextRecognitionLanguage = TextRecognitionLanguage.LATIN): MLKitTextRecognitionService {
    val textRecognizer = createTextRecognizer(language)
    return MLKitTextRecognitionService(textRecognizer)
  }
}
