package com.margelo.nitro.visioncameramlkit

import java.io.Closeable
import java.io.File
import java.io.IOException

internal class ResolvedStaticImage(
  val file: File,
  private val deleteOnClose: Boolean,
) : Closeable {
  override fun close() {
    if (deleteOnClose && file.exists() && !file.delete()) {
      throw IOException("Failed to delete temporary image file.")
    }
  }
}
