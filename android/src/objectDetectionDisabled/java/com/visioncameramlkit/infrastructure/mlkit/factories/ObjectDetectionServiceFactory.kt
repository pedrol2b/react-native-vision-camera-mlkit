package com.visioncameramlkit.infrastructure.mlkit.factories

import com.visioncameramlkit.domain.models.ObjectDetectionOptions
import com.visioncameramlkit.domain.models.ObjectDetectionResult
import com.visioncameramlkit.domain.services.IRecognitionService

object ObjectDetectionServiceFactory {
  fun create(options: ObjectDetectionOptions = ObjectDetectionOptions()): IRecognitionService<ObjectDetectionResult> =
    throw IllegalStateException(
      "Object detection is not enabled in this build. Enable objectDetection in your MLKit " +
        "configuration to use this feature.",
    )
}
