package com.visioncameramlkit.domain.models

data class BoundingBox(
  val x: Double,
  val y: Double,
  val centerX: Double,
  val centerY: Double,
  val width: Double,
  val height: Double,
  val top: Double,
  val left: Double,
  val bottom: Double,
  val right: Double,
)
