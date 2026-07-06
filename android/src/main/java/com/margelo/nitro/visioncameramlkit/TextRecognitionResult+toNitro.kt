package com.margelo.nitro.visioncameramlkit

internal fun com.visioncameramlkit.domain.models.TextRecognitionResult.toNitroResult(): TextRecognitionResult =
  TextRecognitionResult(
    text = text ?: "",
    blocks = blocks.map { it.toNitroTextBlock() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.TextBlock.toNitroTextBlock(): TextBlock =
  TextBlock(
    bounds = bounds.toNitroBoundingBox(),
    corners = corners.toNitroCorners(),
    languages = languages.toTypedArray(),
    text = text,
    lines = lines.map { it.toNitroTextLine() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.TextLine.toNitroTextLine(): TextLine =
  TextLine(
    bounds = bounds.toNitroBoundingBox(),
    corners = corners.toNitroCorners(),
    confidence = confidence.toNullableDoubleVariant(),
    angle = angle.toNullableDoubleVariant(),
    languages = languages.toTypedArray(),
    text = text,
    elements = elements.map { it.toNitroTextElement() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.TextElement.toNitroTextElement(): TextElement =
  TextElement(
    bounds = bounds.toNitroBoundingBox(),
    corners = corners.toNitroCorners(),
    confidence = confidence.toNullableDoubleVariant(),
    angle = angle.toNullableDoubleVariant(),
    languages = languages.toTypedArray(),
    text = text,
    symbols = symbols.map { it.toNitroTextSymbol() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.TextSymbol.toNitroTextSymbol(): TextSymbol =
  TextSymbol(
    bounds = bounds.toNitroBoundingBox(),
    corners = corners.toNitroCorners(),
    confidence = confidence ?: 0.0,
    angle = angle ?: 0.0,
    languages = languages.toTypedArray(),
    text = text,
  )
