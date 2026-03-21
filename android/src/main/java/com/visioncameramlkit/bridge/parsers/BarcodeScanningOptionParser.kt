package com.visioncameramlkit.bridge.parsers

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.visioncameramlkit.domain.models.BarcodeFormatOption

object BarcodeScanningOptionParser {
  fun parseFormats(value: Any?): List<BarcodeFormatOption> =
    (value as? List<*>)
      ?.mapNotNull { item -> parseFormat(item as? String) }
      ?: emptyList()

  @Suppress("ReturnCount")
  fun parseFormats(readableMap: ReadableMap): List<BarcodeFormatOption> {
    if (!readableMap.hasKey("formats") || readableMap.isNull("formats")) {
      return emptyList()
    }
    val readableArray: ReadableArray = readableMap.getArray("formats") ?: return emptyList()
    val parsed = mutableListOf<BarcodeFormatOption>()
    for (index in 0 until readableArray.size()) {
      val formatString = readableArray.getString(index)
      parseFormat(formatString)?.let(parsed::add)
    }
    return parsed
  }

  fun parseEnableAllPotentialBarcodes(value: Any?): Boolean = value as? Boolean ?: false

  fun parseEnableAllPotentialBarcodes(readableMap: ReadableMap): Boolean {
    if (!readableMap.hasKey("enableAllPotentialBarcodes") || readableMap.isNull("enableAllPotentialBarcodes")) {
      return false
    }
    return readableMap.getBoolean("enableAllPotentialBarcodes")
  }

  private fun parseFormat(format: String?): BarcodeFormatOption? =
    format
      ?.trim()
      ?.takeIf { it.isNotEmpty() }
      ?.let { name -> runCatching { BarcodeFormatOption.valueOf(name) }.getOrNull() }
}
