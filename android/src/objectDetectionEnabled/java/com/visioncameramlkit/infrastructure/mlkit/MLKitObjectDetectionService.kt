package com.visioncameramlkit.infrastructure.mlkit

import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.objects.DetectedObject
import com.google.mlkit.vision.objects.ObjectDetector
import com.visioncameramlkit.domain.models.ObjectDetectionResult
import com.visioncameramlkit.domain.models.ProcessedImage
import com.visioncameramlkit.domain.services.IRecognitionService
import com.visioncameramlkit.infrastructure.mlkit.adapters.MLKitObjectAdapter

class MLKitObjectDetectionService(
  private val objectDetector: ObjectDetector,
) : IRecognitionService<ObjectDetectionResult> {
  // ML Kit's on-device detectors are not documented as safe for concurrent use.
  // This instance is shared between the synchronous frame-processor path and the
  // async static-image path, so calls (and disposal) must be serialized.
  private val lock = Any()

  override fun recognize(image: ProcessedImage): ObjectDetectionResult =
    synchronized(lock) {
      val task = objectDetector.process(image.image)
      val objects: List<DetectedObject> = Tasks.await(task)
      MLKitObjectAdapter.toDomain(objects)
    }

  override fun close() {
    synchronized(lock) {
      objectDetector.close()
    }
  }
}
