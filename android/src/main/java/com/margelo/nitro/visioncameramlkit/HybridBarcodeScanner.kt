package com.margelo.nitro.visioncameramlkit

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec

@DoNotStrip
@Keep
class HybridBarcodeScanner(
  private val options: BarcodeScannerOptions,
) : HybridBarcodeScannerSpec() {
  override fun recognize(frame: HybridFrameSpec, args: MLKitBaseArguments?): BarcodeScannerResult {
    throw Error("VisionCamera v5 barcode frame processing is not implemented yet.")
  }
}
