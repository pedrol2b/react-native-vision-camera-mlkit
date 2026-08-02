package com.visioncameramlkit.infrastructure.mlkit.adapters

import com.google.mlkit.vision.text.Text
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner
import com.visioncameramlkit.domain.models.TextBlock
import com.visioncameramlkit.domain.models.TextElement
import com.visioncameramlkit.domain.models.TextLine
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.models.TextSymbol

object MLKitTextAdapter {
  fun toDomain(mlkitText: Text?): TextRecognitionResult =
    TextRecognitionResult(
      text = mlkitText?.text,
      blocks = mlkitText?.textBlocks?.map { toTextBlock(it) } ?: emptyList(),
    )

  private fun toTextBlock(block: Text.TextBlock): TextBlock =
    TextBlock(
      text = block.text,
      bounds = block.boundingBox?.let { toBoundingBox(it) },
      corners = block.cornerPoints?.map { toCorner(it) },
      lines = block.lines.map { toTextLine(it) },
      languages = listOf(block.recognizedLanguage),
    )

  private fun toTextLine(line: Text.Line): TextLine =
    TextLine(
      text = line.text,
      bounds = line.boundingBox?.let { toBoundingBox(it) },
      corners = line.cornerPoints?.map { toCorner(it) },
      elements = line.elements.map { toTextElement(it) },
      confidence = line.confidence.toDouble(),
      angle = line.angle.toDouble(),
      languages = listOf(line.recognizedLanguage),
    )

  private fun toTextElement(element: Text.Element): TextElement =
    TextElement(
      text = element.text,
      bounds = element.boundingBox?.let { toBoundingBox(it) },
      corners = element.cornerPoints?.map { toCorner(it) },
      symbols = element.symbols.map { toTextSymbol(it) },
      confidence = element.confidence.toDouble(),
      angle = element.angle.toDouble(),
      languages = listOf(element.recognizedLanguage),
    )

  private fun toTextSymbol(symbol: Text.Symbol): TextSymbol =
    TextSymbol(
      text = symbol.text,
      bounds = symbol.boundingBox?.let { toBoundingBox(it) },
      corners = symbol.cornerPoints?.map { toCorner(it) },
      confidence = symbol.confidence.toDouble(),
      angle = symbol.angle.toDouble(),
      languages = listOf(symbol.recognizedLanguage),
    )

  private fun toBoundingBox(rect: android.graphics.Rect): BoundingBox =
    BoundingBox(
      x = rect.exactCenterX().toDouble(),
      y = rect.exactCenterY().toDouble(),
      centerX = rect.centerX().toDouble(),
      centerY = rect.centerY().toDouble(),
      width = rect.width().toDouble(),
      height = rect.height().toDouble(),
      top = rect.top.toDouble(),
      left = rect.left.toDouble(),
      bottom = rect.bottom.toDouble(),
      right = rect.right.toDouble(),
    )

  private fun toCorner(point: android.graphics.Point): Corner = Corner(x = point.x.toDouble(), y = point.y.toDouble())
}
