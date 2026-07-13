package com.visioncameramlkit.domain.models

/**
 * Remaps every bounding box and corner in this result tree from processed-image
 * coordinates back to source image/frame coordinates, using [metadata]'s crop offset
 * and scale factor. See [BoundingBox.remap] and [Corner.remap] for the primitive.
 */
fun TextRecognitionResult.remap(metadata: ImageMetadata): TextRecognitionResult = copy(blocks = blocks.map { it.remap(metadata) })

private fun TextBlock.remap(metadata: ImageMetadata): TextBlock =
  copy(
    bounds = bounds?.remap(metadata),
    corners = corners?.map { it.remap(metadata) },
    lines = lines.map { it.remap(metadata) },
  )

private fun TextLine.remap(metadata: ImageMetadata): TextLine =
  copy(
    bounds = bounds?.remap(metadata),
    corners = corners?.map { it.remap(metadata) },
    elements = elements.map { it.remap(metadata) },
  )

private fun TextElement.remap(metadata: ImageMetadata): TextElement =
  copy(
    bounds = bounds?.remap(metadata),
    corners = corners?.map { it.remap(metadata) },
    symbols = symbols.map { it.remap(metadata) },
  )

private fun TextSymbol.remap(metadata: ImageMetadata): TextSymbol =
  copy(
    bounds = bounds?.remap(metadata),
    corners = corners?.map { it.remap(metadata) },
  )
