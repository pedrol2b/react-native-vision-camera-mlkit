package com.margelo.nitro.visioncameramlkit

import com.visioncameramlkit.domain.models.Orientation as DomainOrientation

internal fun Orientation?.toDomainOrientation(): DomainOrientation? =
  when (this) {
    Orientation.PORTRAIT -> DomainOrientation.PORTRAIT
    Orientation.PORTRAIT_UPSIDE_DOWN -> DomainOrientation.PORTRAIT_UPSIDE_DOWN
    Orientation.LANDSCAPE_LEFT -> DomainOrientation.LANDSCAPE_LEFT
    Orientation.LANDSCAPE_RIGHT -> DomainOrientation.LANDSCAPE_RIGHT
    null -> null
  }
