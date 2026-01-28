package com.visioncameramlkit.domain.models

/**
 * Dummy enum for iOS parity. Android handles rotation automatically, so this is not used.
 * @see com.visioncameramlkit.domain.models.OutputOrientation (iOS)
 */
enum class OutputOrientation {
  PORTRAIT,
  PORTRAIT_UPSIDE_DOWN,
  LANDSCAPE_LEFT,
  LANDSCAPE_RIGHT,
  ;

  companion object {
    fun fromString(value: String?): OutputOrientation? =
      when (value) {
        "portrait" -> PORTRAIT
        "portrait-upside-down" -> PORTRAIT_UPSIDE_DOWN
        "landscape-left" -> LANDSCAPE_LEFT
        "landscape-right" -> LANDSCAPE_RIGHT
        else -> null
      }
  }
}
