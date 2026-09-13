package com.visioncameramlkit.infrastructure.mlkit.adapters

import com.google.mlkit.vision.objects.DetectedObject
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.DetectedObjectData
import com.visioncameramlkit.domain.models.ObjectDetectionResult
import com.visioncameramlkit.domain.models.ObjectLabelData

object MLKitObjectAdapter {
  fun toDomain(objects: List<DetectedObject>): ObjectDetectionResult = ObjectDetectionResult(objects = objects.map { toDetectedObject(it) })

  private fun toDetectedObject(detectedObject: DetectedObject): DetectedObjectData =
    DetectedObjectData(
      bounds = toBoundingBox(detectedObject.boundingBox),
      trackingId = detectedObject.trackingId?.toDouble(),
      labels = detectedObject.labels.map { toObjectLabel(it) },
    )

  private fun toObjectLabel(label: DetectedObject.Label): ObjectLabelData =
    ObjectLabelData(
      text = label.text,
      index = label.index.toDouble(),
      confidence = label.confidence.toDouble(),
    )

  private fun toBoundingBox(rect: android.graphics.Rect): BoundingBox =
    BoundingBox(
      x = rect.exactCenterX().toDouble(),
      y = rect.exactCenterY().toDouble(),
      centerX = rect.centerX().toDouble(),
      centerY = rect.centerY().toDouble(),
      width = rect.width().toDouble(),
      height = rect.height().toDouble(),
      top = rect.top.toDouble(),
      left = rect.left.toDouble(),
      bottom = rect.bottom.toDouble(),
      right = rect.right.toDouble(),
    )
}
