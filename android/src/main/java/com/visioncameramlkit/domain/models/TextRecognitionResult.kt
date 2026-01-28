package com.visioncameramlkit.domain.models

data class TextRecognitionResult(
  val text: String?,
  val blocks: List<TextBlock>,
)

data class TextBlock(
  val text: String,
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val lines: List<TextLine>,
  val languages: List<String>,
)

data class TextLine(
  val text: String,
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val elements: List<TextElement>,
  val confidence: Double?,
  val angle: Double?,
  val languages: List<String>,
)

data class TextElement(
  val text: String,
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val symbols: List<TextSymbol>,
  val confidence: Double?,
  val angle: Double?,
  val languages: List<String>,
)

data class TextSymbol(
  val text: String,
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val confidence: Double?,
  val angle: Double?,
  val languages: List<String>,
)
