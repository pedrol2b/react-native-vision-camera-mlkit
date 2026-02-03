package com.visioncameramlkit.domain.models

data class BarcodeScanningResult(
  val barcodes: List<BarcodeResult>,
)

data class BarcodeResult(
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val rawValue: String?,
  val displayValue: String?,
  val format: BarcodeFormatOption,
  val valueType: BarcodeValueType,
  val content: Map<String, Any?>?,
)
