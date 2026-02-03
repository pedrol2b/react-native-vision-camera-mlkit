package com.visioncameramlkit.infrastructure.serializers

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.visioncameramlkit.domain.models.BarcodeResult
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner

object BarcodeScanningSerializer {
  fun toWritableMap(result: BarcodeScanningResult): WritableNativeMap =
    WritableNativeMap().apply {
      putArray("barcodes", toBarcodesArray(result.barcodes))
    }

  fun toReactNativeMap(result: BarcodeScanningResult): HashMap<String, Any> {
    @Suppress("UNCHECKED_CAST")
    return toWritableMap(result).toHashMap() as HashMap<String, Any>
  }

  private fun toBarcodesArray(barcodes: List<BarcodeResult>): WritableNativeArray =
    WritableNativeArray().apply {
      barcodes.forEach { barcode -> pushMap(toBarcodeMap(barcode)) }
    }

  private fun toBarcodeMap(barcode: BarcodeResult): WritableNativeMap =
    WritableNativeMap().apply {
      barcode.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      barcode.corners?.let { putArray("corners", toCornersArray(it)) }
      barcode.rawValue?.let { putString("rawValue", it) }
      barcode.displayValue?.let { putString("displayValue", it) }
      putString("format", barcode.format.name)
      putString("valueType", barcode.valueType.name)
      barcode.content?.let { content ->
        @Suppress("UNCHECKED_CAST")
        putMap("content", Arguments.makeNativeMap(content as HashMap<String, Any?>))
      }
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
}
