package com.margelo.nitro.visioncameramlkit

internal fun RegionOfInterest?.toDomainRegionOfInterest(): com.visioncameramlkit.domain.models.RegionOfInterest? =
  this?.let {
    com.visioncameramlkit.domain.models.RegionOfInterest(
      x = it.x.toFloat(),
      y = it.y.toFloat(),
      width = it.width.toFloat(),
      height = it.height.toFloat(),
      unit = it.unit.toDomainRegionOfInterestUnit(),
    )
  }

private fun RegionOfInterestUnit?.toDomainRegionOfInterestUnit(): com.visioncameramlkit.domain.models.RegionOfInterestUnit =
  when (this) {
    RegionOfInterestUnit.PIXEL -> com.visioncameramlkit.domain.models.RegionOfInterestUnit.PIXEL

    RegionOfInterestUnit.NORMALIZED,
    null,
    -> com.visioncameramlkit.domain.models.RegionOfInterestUnit.NORMALIZED
  }
