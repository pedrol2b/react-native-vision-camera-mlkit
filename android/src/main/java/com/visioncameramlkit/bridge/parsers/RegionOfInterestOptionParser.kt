package com.visioncameramlkit.bridge.parsers

import com.facebook.react.bridge.ReadableMap
import com.visioncameramlkit.domain.models.RegionOfInterest
import com.visioncameramlkit.domain.models.RegionOfInterestUnit

object RegionOfInterestOptionParser {
  /**
   * Parses an optional `roi` key from [readableMap] into a domain [RegionOfInterest].
   * Returns `null` when the key is absent, matching the "no ROI" default.
   */
  fun parse(readableMap: ReadableMap): RegionOfInterest? {
    if (!readableMap.hasKey("roi") || readableMap.isNull("roi")) {
      return null
    }
    val roiMap = readableMap.getMap("roi") ?: return null

    return RegionOfInterest(
      x = roiMap.getDouble("x").toFloat(),
      y = roiMap.getDouble("y").toFloat(),
      width = roiMap.getDouble("width").toFloat(),
      height = roiMap.getDouble("height").toFloat(),
      unit = parseUnit(roiMap.getString("unit")),
    )
  }

  private fun parseUnit(unit: String?): RegionOfInterestUnit =
    when (unit) {
      "pixel" -> RegionOfInterestUnit.PIXEL
      else -> RegionOfInterestUnit.NORMALIZED
    }
}
