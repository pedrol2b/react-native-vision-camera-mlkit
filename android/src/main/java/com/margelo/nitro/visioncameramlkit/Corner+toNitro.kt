package com.margelo.nitro.visioncameramlkit

internal fun com.visioncameramlkit.domain.models.Corner.toNitroCorner(): Corner =
  Corner(
    x = x,
    y = y,
  )

internal fun List<com.visioncameramlkit.domain.models.Corner>?.toNitroCorners(): Array<Corner> =
  this?.map { it.toNitroCorner() }?.toTypedArray() ?: emptyArray()
