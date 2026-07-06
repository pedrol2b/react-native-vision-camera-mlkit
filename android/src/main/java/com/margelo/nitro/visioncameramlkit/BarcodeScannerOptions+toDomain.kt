package com.margelo.nitro.visioncameramlkit

import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions

internal fun BarcodeScannerOptions.toDomainBarcodeScanningOptions(): BarcodeScanningOptions =
  BarcodeScanningOptions(
    formats = formats.toDomainBarcodeFormats(),
    enableAllPotentialBarcodes = enableAllPotentialBarcodes ?: false,
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
  )

internal fun BarcodeScannerOptions.toImagePreprocessingOptions(): ImagePreprocessingOptions =
  ImagePreprocessingOptions(
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
  )
