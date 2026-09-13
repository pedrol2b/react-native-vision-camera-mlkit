package com.margelo.nitro.visioncameramlkit

import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.ObjectDetectionOptions
import com.visioncameramlkit.domain.models.ObjectDetectorModeOption

internal fun ObjectDetectorOptions.toDomainObjectDetectionOptions(): ObjectDetectionOptions =
  ObjectDetectionOptions(
    detectorMode = detectorMode.toDomainDetectorMode(),
    shouldEnableMultipleObjects = shouldEnableMultipleObjects ?: false,
    shouldEnableClassification = shouldEnableClassification ?: false,
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
  )

internal fun ObjectDetectorOptions.toImagePreprocessingOptions(): ImagePreprocessingOptions =
  ImagePreprocessingOptions(
    invertColors = invertColors ?: false,
    scaleFactor = scaleFactor?.toFloat() ?: 1.0f,
    roi = roi.toDomainRegionOfInterest(),
    orientation = orientation.toDomainOrientation(),
  )

internal fun ObjectDetectorMode?.toDomainDetectorMode(): ObjectDetectorModeOption =
  when (this) {
    ObjectDetectorMode.SINGLEIMAGE -> ObjectDetectorModeOption.SINGLE_IMAGE
    ObjectDetectorMode.STREAM, null -> ObjectDetectorModeOption.STREAM
  }
