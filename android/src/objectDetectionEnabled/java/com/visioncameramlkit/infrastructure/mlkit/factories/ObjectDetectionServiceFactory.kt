package com.visioncameramlkit.infrastructure.mlkit.factories

import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.ObjectDetector
import com.google.mlkit.vision.objects.defaults.ObjectDetectorOptions
import com.visioncameramlkit.domain.models.ObjectDetectionOptions
import com.visioncameramlkit.domain.models.ObjectDetectorModeOption
import com.visioncameramlkit.infrastructure.mlkit.MLKitObjectDetectionService

object ObjectDetectionServiceFactory {
  fun createObjectDetector(options: ObjectDetectionOptions = ObjectDetectionOptions()): ObjectDetector {
    val builder = ObjectDetectorOptions.Builder()

    builder.setDetectorMode(
      when (options.detectorMode) {
        ObjectDetectorModeOption.SINGLE_IMAGE -> ObjectDetectorOptions.SINGLE_IMAGE_MODE
        ObjectDetectorModeOption.STREAM -> ObjectDetectorOptions.STREAM_MODE
      },
    )

    if (options.shouldEnableMultipleObjects) {
      builder.enableMultipleObjects()
    }

    if (options.shouldEnableClassification) {
      builder.enableClassification()
    }

    return ObjectDetection.getClient(builder.build())
  }

  fun create(options: ObjectDetectionOptions = ObjectDetectionOptions()): MLKitObjectDetectionService {
    val detector = createObjectDetector(options)
    return MLKitObjectDetectionService(detector)
  }
}
