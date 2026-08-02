package com.visioncameramlkit.domain.models

object StaticImageLimits {
  const val MAX_ENCODED_BYTES: Long = 25L * 1024L * 1024L
  const val MAX_PIXEL_COUNT: Long = 4_000_000L
  const val MAX_DIMENSION: Int = 4_096
}
