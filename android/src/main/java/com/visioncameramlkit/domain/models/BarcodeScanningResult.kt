package com.visioncameramlkit.domain.models

data class BarcodeScanningResult(
  val barcodes: List<BarcodeData>,
)

data class BarcodeData(
  val bounds: BoundingBox?,
  val corners: List<Corner>?,
  val format: Int,
  val formatName: String,
  val valueType: Int,
  val valueTypeName: String,
  val rawValue: String?,
  val displayValue: String?,
  val rawBytes: List<Int>?,
  val isPotential: Boolean,
  val value: BarcodeParsedValue?,
)

data class BarcodeParsedValue(
  val type: String,
  val data: Map<String, Any?>,
)
