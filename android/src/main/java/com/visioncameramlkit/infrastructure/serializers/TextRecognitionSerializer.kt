package com.visioncameramlkit.infrastructure.serializers

import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner
import com.visioncameramlkit.domain.models.TextBlock
import com.visioncameramlkit.domain.models.TextElement
import com.visioncameramlkit.domain.models.TextLine
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.models.TextSymbol

@Suppress("TooManyFunctions")
object TextRecognitionSerializer {
  fun toWritableMap(result: TextRecognitionResult): WritableNativeMap =
    WritableNativeMap().apply {
      putString("text", result.text)
      putArray("blocks", toBlocksArray(result.blocks))
    }

  fun toReactNativeMap(result: TextRecognitionResult): HashMap<String, Any> {
    @Suppress("UNCHECKED_CAST")
    return toWritableMap(result).toHashMap() as HashMap<String, Any>
  }

  private fun toBlocksArray(blocks: List<TextBlock>): WritableNativeArray =
    WritableNativeArray().apply {
      blocks.forEach { block -> pushMap(toBlockMap(block)) }
    }

  private fun toBlockMap(block: TextBlock): WritableNativeMap =
    WritableNativeMap().apply {
      putString("text", block.text)
      block.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      block.corners?.let { putArray("corners", toCornersArray(it)) }
      putArray("lines", toLinesArray(block.lines))
      putArray("languages", toLanguagesArray(block.languages))
    }

  private fun toLinesArray(lines: List<TextLine>): WritableNativeArray =
    WritableNativeArray().apply {
      lines.forEach { line -> pushMap(toLineMap(line)) }
    }

  private fun toLineMap(line: TextLine): WritableNativeMap =
    WritableNativeMap().apply {
      putString("text", line.text)
      line.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      line.corners?.let { putArray("corners", toCornersArray(it)) }
      putArray("elements", toElementsArray(line.elements))
      line.confidence?.let { putDouble("confidence", it) }
      line.angle?.let { putDouble("angle", it) }
      putArray("languages", toLanguagesArray(line.languages))
    }

  private fun toElementsArray(elements: List<TextElement>): WritableNativeArray =
    WritableNativeArray().apply {
      elements.forEach { element -> pushMap(toElementMap(element)) }
    }

  private fun toElementMap(element: TextElement): WritableNativeMap =
    WritableNativeMap().apply {
      putString("text", element.text)
      element.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      element.corners?.let { putArray("corners", toCornersArray(it)) }
      putArray("symbols", toSymbolsArray(element.symbols))
      element.confidence?.let { putDouble("confidence", it) }
      element.angle?.let { putDouble("angle", it) }
      putArray("languages", toLanguagesArray(element.languages))
    }

  private fun toSymbolsArray(symbols: List<TextSymbol>): WritableNativeArray =
    WritableNativeArray().apply {
      symbols.forEach { symbol -> pushMap(toSymbolMap(symbol)) }
    }

  private fun toSymbolMap(symbol: TextSymbol): WritableNativeMap =
    WritableNativeMap().apply {
      putString("text", symbol.text)
      symbol.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      symbol.corners?.let { putArray("corners", toCornersArray(it)) }
      symbol.confidence?.let { putDouble("confidence", it) }
      symbol.angle?.let { putDouble("angle", it) }
      putArray("languages", toLanguagesArray(symbol.languages))
    }

  private fun toBoundsMap(bounds: BoundingBox): WritableNativeMap =
    WritableNativeMap().apply {
      putDouble("x", bounds.x)
      putDouble("y", bounds.y)
      putDouble("centerX", bounds.centerX)
      putDouble("centerY", bounds.centerY)
      putDouble("width", bounds.width)
      putDouble("height", bounds.height)
      putDouble("top", bounds.top)
      putDouble("left", bounds.left)
      putDouble("bottom", bounds.bottom)
      putDouble("right", bounds.right)
    }

  private fun toCornersArray(corners: List<Corner>): WritableNativeArray =
    WritableNativeArray().apply {
      corners.forEach { corner -> pushMap(toCornerMap(corner)) }
    }

  private fun toCornerMap(corner: Corner): WritableNativeMap =
    WritableNativeMap().apply {
      putDouble("x", corner.x)
      putDouble("y", corner.y)
    }

  private fun toLanguagesArray(languages: List<String>): WritableNativeArray =
    WritableNativeArray().apply {
      languages.forEach { pushString(it) }
    }
}
