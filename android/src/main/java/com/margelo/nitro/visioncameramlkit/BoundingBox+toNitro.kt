package com.margelo.nitro.visioncameramlkit

private val emptyBoundingBox =
  BoundingBox(
    x = 0.0,
    y = 0.0,
    centerX = 0.0,
    centerY = 0.0,
    width = 0.0,
    height = 0.0,
    top = 0.0,
    left = 0.0,
    bottom = 0.0,
    right = 0.0,
  )

internal fun com.visioncameramlkit.domain.models.BoundingBox?.toNitroBoundingBox(): BoundingBox =
  this?.let {
    BoundingBox(
      x = it.x,
      y = it.y,
      centerX = it.centerX,
      centerY = it.centerY,
      width = it.width,
      height = it.height,
      top = it.top,
      left = it.left,
      bottom = it.bottom,
      right = it.right,
    )
  } ?: emptyBoundingBox
