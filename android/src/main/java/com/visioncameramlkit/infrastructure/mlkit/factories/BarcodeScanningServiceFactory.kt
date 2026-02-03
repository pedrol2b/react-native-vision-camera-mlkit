package com.visioncameramlkit.infrastructure.mlkit.factories

import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.visioncameramlkit.domain.models.BarcodeFormatOption
import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.infrastructure.mlkit.MLKitBarcodeScanningService

object BarcodeScanningServiceFactory {
  fun create(options: BarcodeScanningOptions = BarcodeScanningOptions()): MLKitBarcodeScanningService {
    val scannerOptions = buildScannerOptions(options)
    val barcodeScanner = BarcodeScanning.getClient(scannerOptions)
    return MLKitBarcodeScanningService(barcodeScanner)
  }

  private fun buildScannerOptions(options: BarcodeScanningOptions): BarcodeScannerOptions {
    val formats = resolveFormats(options.formats)
    val builder =
      BarcodeScannerOptions
        .Builder()
        .setBarcodeFormats(formats.first(), *formats.drop(1).toIntArray())

    if (options.enableAllPotentialBarcodes) {
      builder.enableAllPotentialBarcodes()
    }

    return builder.build()
  }

  private fun resolveFormats(formats: List<BarcodeFormatOption>): List<Int> {
    if (formats.isEmpty() || formats.contains(BarcodeFormatOption.ALL)) {
      return listOf(Barcode.FORMAT_ALL_FORMATS)
    }

    val resolved = formats.mapNotNull { toMlKitFormat(it) }
    return if (resolved.isEmpty()) {
      listOf(Barcode.FORMAT_ALL_FORMATS)
    } else {
      resolved
    }
  }

  private fun toMlKitFormat(format: BarcodeFormatOption): Int? =
    when (format) {
      BarcodeFormatOption.CODE_128 -> Barcode.FORMAT_CODE_128
      BarcodeFormatOption.CODE_39 -> Barcode.FORMAT_CODE_39
      BarcodeFormatOption.CODE_93 -> Barcode.FORMAT_CODE_93
      BarcodeFormatOption.CODABAR -> Barcode.FORMAT_CODABAR
      BarcodeFormatOption.DATA_MATRIX -> Barcode.FORMAT_DATA_MATRIX
      BarcodeFormatOption.EAN_13 -> Barcode.FORMAT_EAN_13
      BarcodeFormatOption.EAN_8 -> Barcode.FORMAT_EAN_8
      BarcodeFormatOption.ITF -> Barcode.FORMAT_ITF
      BarcodeFormatOption.QR_CODE -> Barcode.FORMAT_QR_CODE
      BarcodeFormatOption.UPC_A -> Barcode.FORMAT_UPC_A
      BarcodeFormatOption.UPC_E -> Barcode.FORMAT_UPC_E
      BarcodeFormatOption.PDF417 -> Barcode.FORMAT_PDF417
      BarcodeFormatOption.AZTEC -> Barcode.FORMAT_AZTEC
      BarcodeFormatOption.ALL -> Barcode.FORMAT_ALL_FORMATS
      BarcodeFormatOption.UNKNOWN -> null
    }
}
