package com.visioncameramlkit.infrastructure.mlkit

import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.barcode.BarcodeScanner
import com.google.mlkit.vision.barcode.common.Barcode
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.ProcessedImage
import com.visioncameramlkit.domain.services.IRecognitionService
import com.visioncameramlkit.infrastructure.mlkit.adapters.MLKitBarcodeAdapter

class MLKitBarcodeScanningService(
  private val barcodeScanner: BarcodeScanner,
) : IRecognitionService<BarcodeScanningResult> {
  // ML Kit's on-device detectors are not documented as safe for concurrent use.
  // This instance is shared between the synchronous frame-processor path and the
  // async static-image path, so calls (and disposal) must be serialized.
  private val lock = Any()

  override fun recognize(image: ProcessedImage): BarcodeScanningResult =
    synchronized(lock) {
      val task = barcodeScanner.process(image.image)
      val barcodes: List<Barcode> = Tasks.await(task)
      MLKitBarcodeAdapter.toDomain(barcodes)
    }

  override fun close() {
    synchronized(lock) {
      barcodeScanner.close()
    }
  }
}
