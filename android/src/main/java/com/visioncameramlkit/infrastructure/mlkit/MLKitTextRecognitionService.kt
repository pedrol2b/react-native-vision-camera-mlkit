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
  override fun recognize(image: ProcessedImage): TextRecognitionResult {
    val task = textRecognizer.process(image.image)
    val mlkitText: Text? = Tasks.await(task)
    return MLKitTextAdapter.toDomain(mlkitText)
  }
}
