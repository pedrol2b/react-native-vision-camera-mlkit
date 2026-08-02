package com.visioncameramlkit.infrastructure.mlkit

import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognizer
import com.visioncameramlkit.domain.models.ProcessedImage
import com.visioncameramlkit.domain.models.TextRecognitionResult
import com.visioncameramlkit.domain.services.IRecognitionService
import com.visioncameramlkit.infrastructure.mlkit.adapters.MLKitTextAdapter

class MLKitTextRecognitionService(
  private val textRecognizer: TextRecognizer,
) : IRecognitionService<TextRecognitionResult> {
  // ML Kit's on-device detectors are not documented as safe for concurrent use.
  // This instance is shared between the synchronous frame-processor path and the
  // async static-image path, so calls (and disposal) must be serialized.
  private val lock = Any()

  override fun recognize(image: ProcessedImage): TextRecognitionResult =
    synchronized(lock) {
      val task = textRecognizer.process(image.image)
      val mlkitText: Text? = Tasks.await(task)
      MLKitTextAdapter.toDomain(mlkitText)
    }

  override fun close() {
    synchronized(lock) {
      textRecognizer.close()
    }
  }
}
