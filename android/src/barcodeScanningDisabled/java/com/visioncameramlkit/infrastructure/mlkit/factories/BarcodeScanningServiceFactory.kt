package com.visioncameramlkit.infrastructure.mlkit.factories

import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.services.IRecognitionService

object BarcodeScanningServiceFactory {
  fun create(options: BarcodeScanningOptions = BarcodeScanningOptions()): IRecognitionService<BarcodeScanningResult> {
    throw IllegalStateException(
      "Barcode scanning is not enabled in this build. Enable barcodeScanning in your MLKit " +
        "configuration to use this feature.",
    )
  }
}
