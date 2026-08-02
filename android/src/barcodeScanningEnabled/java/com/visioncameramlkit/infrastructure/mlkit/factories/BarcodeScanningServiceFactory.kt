package com.visioncameramlkit.infrastructure.mlkit.factories

import com.google.mlkit.vision.barcode.BarcodeScanner
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.visioncameramlkit.domain.models.BarcodeFormatOption
import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.infrastructure.mlkit.MLKitBarcodeScanningService

object BarcodeScanningServiceFactory {
  private val barcodeFormatMap: Map<BarcodeFormatOption, Int> =
    mapOf(
      BarcodeFormatOption.UNKNOWN to Barcode.FORMAT_UNKNOWN,
      BarcodeFormatOption.ALL_FORMATS to Barcode.FORMAT_ALL_FORMATS,
      BarcodeFormatOption.CODE_128 to Barcode.FORMAT_CODE_128,
      BarcodeFormatOption.CODE_39 to Barcode.FORMAT_CODE_39,
      BarcodeFormatOption.CODE_93 to Barcode.FORMAT_CODE_93,
      BarcodeFormatOption.CODABAR to Barcode.FORMAT_CODABAR,
      BarcodeFormatOption.DATA_MATRIX to Barcode.FORMAT_DATA_MATRIX,
      BarcodeFormatOption.EAN_13 to Barcode.FORMAT_EAN_13,
      BarcodeFormatOption.EAN_8 to Barcode.FORMAT_EAN_8,
      BarcodeFormatOption.ITF to Barcode.FORMAT_ITF,
      BarcodeFormatOption.QR_CODE to Barcode.FORMAT_QR_CODE,
      BarcodeFormatOption.UPC_A to Barcode.FORMAT_UPC_A,
      BarcodeFormatOption.UPC_E to Barcode.FORMAT_UPC_E,
      BarcodeFormatOption.PDF417 to Barcode.FORMAT_PDF417,
      BarcodeFormatOption.AZTEC to Barcode.FORMAT_AZTEC,
    )

  fun createBarcodeScanner(options: BarcodeScanningOptions = BarcodeScanningOptions()): BarcodeScanner {
    val builder = BarcodeScannerOptions.Builder()

    val selectedFormats =
      options.formats
        .map(::toMlKitFormat)
        .filter { it != Barcode.FORMAT_UNKNOWN && it != Barcode.FORMAT_ALL_FORMATS }

    if (selectedFormats.isNotEmpty()) {
      val first = selectedFormats.first()
      val rest = selectedFormats.drop(1).toIntArray()
      @Suppress("SpreadOperator")
      builder.setBarcodeFormats(first, *rest)
    }

    if (options.enableAllPotentialBarcodes) {
      builder.enableAllPotentialBarcodes()
    }

    return BarcodeScanning.getClient(builder.build())
  }

  fun create(options: BarcodeScanningOptions = BarcodeScanningOptions()): MLKitBarcodeScanningService {
    val scanner = createBarcodeScanner(options)
    return MLKitBarcodeScanningService(scanner)
  }

  private fun toMlKitFormat(format: BarcodeFormatOption): Int = barcodeFormatMap[format] ?: Barcode.FORMAT_UNKNOWN
}
