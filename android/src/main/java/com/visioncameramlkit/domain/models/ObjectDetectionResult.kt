package com.visioncameramlkit.domain.models

data class ObjectDetectionResult(
  val objects: List<DetectedObjectData>,
)

data class DetectedObjectData(
  val bounds: BoundingBox?,
  val trackingId: Double?,
  val labels: List<ObjectLabelData>,
)

data class ObjectLabelData(
  val text: String,
  val index: Double,
  val confidence: Double,
)
