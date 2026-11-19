package com.visioncameramlkit.domain.models

/**
 * Remaps every bounding box in this result from processed-image coordinates back to
 * source image/frame coordinates, using [metadata]'s crop offset and scale factor.
 * See [BoundingBox.remap] for the primitive.
 */
fun ObjectDetectionResult.remap(metadata: ImageMetadata): ObjectDetectionResult = copy(objects = objects.map { it.remap(metadata) })

private fun DetectedObjectData.remap(metadata: ImageMetadata): DetectedObjectData = copy(bounds = bounds?.remap(metadata))
