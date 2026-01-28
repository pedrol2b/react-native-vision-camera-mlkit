package com.visioncameramlkit.domain.models

data class TextRecognitionOptions(
  val language: TextRecognitionLanguage = TextRecognitionLanguage.LATIN,
  val invertColors: Boolean = false,
  // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
  val outputOrientation: OutputOrientation? = null,
  val scaleFactor: Float = 1.0f,
)

enum class TextRecognitionLanguage {
  LATIN,
  CHINESE,
  DEVANAGARI,
  JAPANESE,
  KOREAN,
}
