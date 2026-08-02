package com.margelo.nitro.visioncameramlkit

import android.net.Uri
import com.margelo.nitro.NitroModules
import com.visioncameramlkit.domain.models.StaticImageLimits
import java.io.File
import java.io.FileNotFoundException
import java.io.IOException

internal object StaticImageUriResolver {
  fun resolve(value: String): ResolvedStaticImage {
    require(value.isNotBlank()) { "Image URI must not be blank." }

    val uri = Uri.parse(value)
    val scheme = uri.scheme
    return when {
      scheme == null -> resolveAbsolutePath(value)
      scheme.equals("content", ignoreCase = true) -> resolveContentUri(uri)
      scheme.equals("file", ignoreCase = true) -> resolveFileUri(uri, value)
      else -> throw IllegalArgumentException("Unsupported image URI scheme: $scheme")
    }
  }

  private fun resolveContentUri(uri: Uri): ResolvedStaticImage {
    val context =
      NitroModules.applicationContext
        ?: throw IllegalStateException("NitroModules application context is unavailable.")
    val temporaryFile = File.createTempFile("vision-camera-mlkit-", ".image", context.cacheDir)
    val resolvedImage = ResolvedStaticImage(temporaryFile, deleteOnClose = true)

    try {
      val input =
        context.contentResolver.openInputStream(uri)
          ?: throw FileNotFoundException("Unable to open content URI: $uri")
      input.use { source ->
        temporaryFile.outputStream().use { destination ->
          val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
          var copiedBytes = 0L
          while (true) {
            val bytesRead = source.read(buffer)
            if (bytesRead < 0) break
            copiedBytes += bytesRead
            require(copiedBytes <= StaticImageLimits.MAX_ENCODED_BYTES) {
              "Static image exceeds the 25 MB encoded-size limit."
            }
            destination.write(buffer, 0, bytesRead)
          }
        }
      }
      return resolvedImage
    } catch (error: Throwable) {
      try {
        resolvedImage.close()
      } catch (cleanupError: Throwable) {
        error.addSuppressed(cleanupError)
      }
      throw error
    }
  }

  private fun resolveFileUri(
    uri: Uri,
    originalValue: String,
  ): ResolvedStaticImage {
    val path = uri.path ?: throw IllegalArgumentException("File URI has no path: $originalValue")
    return resolveExistingFile(File(path), originalValue)
  }

  private fun resolveAbsolutePath(value: String): ResolvedStaticImage {
    val file = File(value)
    require(file.isAbsolute) { "Image path must be absolute: $value" }
    return resolveExistingFile(file, value)
  }

  private fun resolveExistingFile(
    file: File,
    originalValue: String,
  ): ResolvedStaticImage {
    if (!file.isFile) {
      throw FileNotFoundException("Image file not found: $originalValue")
    }
    if (!file.canRead()) {
      throw IOException("Image file is not readable: $originalValue")
    }
    require(file.length() <= StaticImageLimits.MAX_ENCODED_BYTES) {
      "Static image exceeds the 25 MB encoded-size limit."
    }
    return ResolvedStaticImage(file, deleteOnClose = false)
  }
}
