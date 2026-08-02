package com.visioncameramlkit.domain.models

data class BarcodeScanningOptions(
  val formats: List<BarcodeFormatOption> = emptyList(),
  val enableAllPotentialBarcodes: Boolean = false,
  val invertColors: Boolean = false,
  // Android handles rotation automatically, so outputOrientation is ignored. Added for iOS parity.
  val outputOrientation: OutputOrientation? = null,
  val scaleFactor: Float = 1.0f,
)

enum class BarcodeFormatOption {
  UNKNOWN,
  ALL_FORMATS,
  CODE_128,
  CODE_39,
  CODE_93,
  CODABAR,
  DATA_MATRIX,
  EAN_13,
  EAN_8,
  ITF,
  QR_CODE,
  UPC_A,
  UPC_E,
  PDF417,
  AZTEC,
}
