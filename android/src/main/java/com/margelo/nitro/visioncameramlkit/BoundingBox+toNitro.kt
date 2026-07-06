package com.margelo.nitro.visioncameramlkit

private val emptyBoundingBox =
  BoundingBox(
    x = 0.0,
    y = 0.0,
    width = 0.0,
    height = 0.0,
  )

internal fun com.visioncameramlkit.domain.models.BoundingBox?.toNitroBoundingBox(): BoundingBox =
  this?.let {
    BoundingBox(
      x = it.x,
      y = it.y,
      width = it.width,
      height = it.height,
    )
  } ?: emptyBoundingBox
