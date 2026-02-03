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
  override fun recognize(image: ProcessedImage): BarcodeScanningResult {
    val task = barcodeScanner.process(image.image)
    val barcodes: List<Barcode> = Tasks.await(task) ?: emptyList()
    return MLKitBarcodeAdapter.toDomain(barcodes)
  }
}
