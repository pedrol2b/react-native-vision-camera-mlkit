package com.margelo.nitro.visioncameramlkit

import com.margelo.nitro.core.AnyMap
import com.visioncameramlkit.domain.models.BarcodeParsedValue

internal fun BarcodeParsedValue.toNitroAnyMap(): AnyMap =
  AnyMap.fromMap(
    mapOf(
      "type" to type,
      "data" to data,
    ),
    ignoreIncompatible = false,
  )
