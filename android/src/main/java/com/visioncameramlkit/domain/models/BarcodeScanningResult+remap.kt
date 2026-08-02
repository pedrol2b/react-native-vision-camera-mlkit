package com.visioncameramlkit.domain.models

/**
 * Remaps every bounding box and corner in this result from processed-image coordinates
 * back to source image/frame coordinates, using [metadata]'s crop offset and scale
 * factor. See [BoundingBox.remap] and [Corner.remap] for the primitive.
 */
fun BarcodeScanningResult.remap(metadata: ImageMetadata): BarcodeScanningResult = copy(barcodes = barcodes.map { it.remap(metadata) })

private fun BarcodeData.remap(metadata: ImageMetadata): BarcodeData =
  copy(
    bounds = bounds?.remap(metadata),
    corners = corners?.map { it.remap(metadata) },
  )
