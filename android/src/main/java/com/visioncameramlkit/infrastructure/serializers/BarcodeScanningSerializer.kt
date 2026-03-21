package com.visioncameramlkit.infrastructure.serializers

import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.visioncameramlkit.domain.models.BarcodeData
import com.visioncameramlkit.domain.models.BarcodeParsedValue
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner

@Suppress("TooManyFunctions")
object BarcodeScanningSerializer {
  fun toWritableMap(result: BarcodeScanningResult): WritableNativeMap =
    WritableNativeMap().apply {
      putArray("barcodes", toBarcodesArray(result.barcodes))
    }

  fun toReactNativeMap(result: BarcodeScanningResult): HashMap<String, Any> {
    @Suppress("UNCHECKED_CAST")
    return toWritableMap(result).toHashMap() as HashMap<String, Any>
  }

  private fun toBarcodesArray(barcodes: List<BarcodeData>): WritableNativeArray =
    WritableNativeArray().apply {
      barcodes.forEach { barcode -> pushMap(toBarcodeMap(barcode)) }
    }

  private fun toBarcodeMap(barcode: BarcodeData): WritableNativeMap =
    WritableNativeMap().apply {
      barcode.bounds?.let { putMap("bounds", toBoundsMap(it)) }
      barcode.corners?.let { putArray("corners", toCornersArray(it)) }
      putInt("format", barcode.format)
      putString("formatName", barcode.formatName)
      putInt("valueType", barcode.valueType)
      putString("valueTypeName", barcode.valueTypeName)
      putString("rawValue", barcode.rawValue)
      putString("displayValue", barcode.displayValue)
      putBoolean("isPotential", barcode.isPotential)
      barcode.rawBytes?.let { putArray("rawBytes", toByteArray(it)) }
      barcode.value?.let { putMap("value", toParsedValueMap(it)) }
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
      corners.forEach { corner ->
        pushMap(
          WritableNativeMap().apply {
            putDouble("x", corner.x)
            putDouble("y", corner.y)
          },
        )
      }
    }

  private fun toByteArray(bytes: List<Int>): WritableNativeArray =
    WritableNativeArray().apply {
      bytes.forEach { byteValue -> pushInt(byteValue) }
    }

  private fun toParsedValueMap(value: BarcodeParsedValue): WritableNativeMap =
    WritableNativeMap().apply {
      putString("type", value.type)
      putMap("data", toDynamicMap(value.data))
    }

  private fun toDynamicMap(map: Map<String, Any?>): WritableNativeMap =
    WritableNativeMap().apply {
      map.forEach { (key, value) ->
        putDynamic(this, key, value)
      }
    }

  private fun toDynamicArray(list: List<Any?>): WritableNativeArray =
    WritableNativeArray().apply {
      list.forEach { value -> pushDynamic(this, value) }
    }

  private fun putDynamic(
    target: WritableNativeMap,
    key: String,
    value: Any?,
  ) {
    when (value) {
      null -> {
        target.putNull(key)
      }

      is String -> {
        target.putString(key, value)
      }

      is Boolean -> {
        target.putBoolean(key, value)
      }

      is Int -> {
        target.putInt(key, value)
      }

      is Long -> {
        target.putDouble(key, value.toDouble())
      }

      is Float -> {
        target.putDouble(key, value.toDouble())
      }

      is Double -> {
        target.putDouble(key, value)
      }

      is Map<*, *> -> {
        @Suppress("UNCHECKED_CAST")
        target.putMap(key, toDynamicMap(value as Map<String, Any?>))
      }

      is List<*> -> {
        @Suppress("UNCHECKED_CAST")
        target.putArray(key, toDynamicArray(value))
      }

      else -> {
        target.putString(key, value.toString())
      }
    }
  }

  private fun pushDynamic(
    target: WritableNativeArray,
    value: Any?,
  ) {
    when (value) {
      null -> {
        target.pushNull()
      }

      is String -> {
        target.pushString(value)
      }

      is Boolean -> {
        target.pushBoolean(value)
      }

      is Int -> {
        target.pushInt(value)
      }

      is Long -> {
        target.pushDouble(value.toDouble())
      }

      is Float -> {
        target.pushDouble(value.toDouble())
      }

      is Double -> {
        target.pushDouble(value)
      }

      is Map<*, *> -> {
        @Suppress("UNCHECKED_CAST")
        target.pushMap(toDynamicMap(value as Map<String, Any?>))
      }

      is List<*> -> {
        @Suppress("UNCHECKED_CAST")
        target.pushArray(toDynamicArray(value))
      }

      else -> {
        target.pushString(value.toString())
      }
    }
  }
}
