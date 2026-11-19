package com.margelo.nitro.visioncameramlkit

internal fun com.visioncameramlkit.domain.models.ObjectDetectionResult.toNitroResult(): ObjectDetectionResult =
  ObjectDetectionResult(
    objects = objects.map { it.toNitroDetectedObject() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.DetectedObjectData.toNitroDetectedObject(): DetectedObject =
  DetectedObject(
    bounds = bounds.toNitroBoundingBox(),
    trackingId = trackingId.toNullableDoubleVariant(),
    labels = labels.map { it.toNitroObjectLabel() }.toTypedArray(),
  )

private fun com.visioncameramlkit.domain.models.ObjectLabelData.toNitroObjectLabel(): ObjectLabel =
  ObjectLabel(
    text = text,
    index = index,
    confidence = confidence,
  )
