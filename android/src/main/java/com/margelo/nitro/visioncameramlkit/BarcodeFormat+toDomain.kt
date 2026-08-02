package com.margelo.nitro.visioncameramlkit

import com.visioncameramlkit.domain.models.BarcodeFormatOption

internal fun BarcodeFormat.toDomainBarcodeFormat(): BarcodeFormatOption =
  runCatching { BarcodeFormatOption.valueOf(name) }.getOrDefault(BarcodeFormatOption.UNKNOWN)

internal fun Array<BarcodeFormat>?.toDomainBarcodeFormats(): List<BarcodeFormatOption> =
  this?.map { it.toDomainBarcodeFormat() } ?: emptyList()
