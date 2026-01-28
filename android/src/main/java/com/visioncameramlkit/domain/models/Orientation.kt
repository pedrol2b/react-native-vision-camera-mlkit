package com.visioncameramlkit.domain.models

enum class Orientation {
  PORTRAIT,
  PORTRAIT_UPSIDE_DOWN,
  LANDSCAPE_LEFT,
  LANDSCAPE_RIGHT,
  ;

  companion object {
    fun fromString(value: String?): Orientation? =
      when (value) {
        "portrait" -> PORTRAIT
        "portrait-upside-down" -> PORTRAIT_UPSIDE_DOWN
        "landscape-left" -> LANDSCAPE_LEFT
        "landscape-right" -> LANDSCAPE_RIGHT
        else -> null
      }
  }
}
