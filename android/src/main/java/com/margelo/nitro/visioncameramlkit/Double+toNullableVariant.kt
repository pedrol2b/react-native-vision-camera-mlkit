package com.margelo.nitro.visioncameramlkit

import com.margelo.nitro.core.NullType

internal fun Double?.toNullableDoubleVariant(): Variant_NullType_Double =
  this?.let { Variant_NullType_Double.create(it) }
    ?: Variant_NullType_Double.create(NullType.NULL)
