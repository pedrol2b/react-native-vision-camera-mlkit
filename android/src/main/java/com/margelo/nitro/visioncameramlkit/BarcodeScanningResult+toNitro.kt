package com.margelo.nitro.visioncameramlkit

internal fun com.visioncameramlkit.domain.models.BarcodeScanningResult.toNitroResult(): BarcodeScannerResult =
  BarcodeScannerResult(
    barcodes = barcodes.map { it.toNitroBarcode() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.BarcodeData.toNitroBarcode(): BarcodeScannerBarcode =
  BarcodeScannerBarcode(
    bounds = bounds?.toNitroBoundingBox(),
    corners = corners?.toNitroCorners(),
    format = format.toDouble(),
    formatName = formatName.toNitroBarcodeFormat(),
    valueType = valueType.toDouble(),
    valueTypeName = valueTypeName.toNitroBarcodeValueTypeName(),
    rawValue = rawValue,
    displayValue = displayValue,
    rawBytes = rawBytes?.map { it.toDouble() }?.toDoubleArray(),
    isPotential = isPotential,
  )

private fun String.toNitroBarcodeFormat(): BarcodeFormat =
  runCatching { BarcodeFormat.valueOf(this) }.getOrDefault(BarcodeFormat.UNKNOWN)

private fun String.toNitroBarcodeValueTypeName(): BarcodeValueTypeName =
  runCatching { BarcodeValueTypeName.valueOf(this) }.getOrDefault(BarcodeValueTypeName.TYPE_UNKNOWN)
