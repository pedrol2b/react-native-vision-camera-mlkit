package com.visioncameramlkit.bridge.handlers

import android.net.Uri
import androidx.core.net.toUri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.visioncameramlkit.application.usecases.RecognizeBarcodesUseCase
import com.visioncameramlkit.bridge.parsers.BarcodeScanningOptionParser
import com.visioncameramlkit.domain.models.BarcodeScanningOptions
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.Orientation
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.BarcodeScanningServiceFactory
import com.visioncameramlkit.infrastructure.serializers.BarcodeScanningSerializer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

class StaticBarcodeScanningHandler(
  private val reactContext: ReactApplicationContext,
) : IStaticImageHandler {
  private val cachedUseCases = mutableMapOf<String, RecognizeBarcodesUseCase>()

  private fun getRecognizeBarcodesUseCase(options: BarcodeScanningOptions): RecognizeBarcodesUseCase {
    val cacheKey =
      buildString {
        append(options.enableAllPotentialBarcodes)
        append("|")
        append(options.formats.joinToString(separator = ",") { it.name })
      }

    return cachedUseCases.getOrPut(cacheKey) {
      RecognizeBarcodesUseCase(
        ImagePreprocessor(),
        BarcodeScanningServiceFactory.create(options),
      )
    }
  }

  override fun process(
    path: String,
    options: ReadableMap,
    promise: Promise,
  ) {
    CoroutineScope(Dispatchers.IO).launch {
      var resolvedImage: ResolvedImage? = null
      try {
        resolvedImage = resolveImage(path)
        val imageFile = resolvedImage.file
        if (!imageFile.exists()) {
          promise.reject("IMAGE_NOT_FOUND_ERROR", "Image file not found at path: $path")
          return@launch
        }

        val imageOptions = parseImageOptions(options)
        val barcodeOptions = parseBarcodeOptions(options)
        val recognizeBarcodesUseCase = getRecognizeBarcodesUseCase(barcodeOptions)

        val result = recognizeBarcodesUseCase.execute(imageFile, imageOptions, barcodeOptions)
        val serializedResult = BarcodeScanningSerializer.toWritableMap(result)

        promise.resolve(serializedResult)
      } catch (
        @Suppress("TooGenericExceptionCaught") e: Exception,
      ) {
        when (e) {
          is IllegalArgumentException -> {
            promise.reject("INVALID_URI_ERROR", e.message)
          }

          is UnsupportedOperationException -> {
            promise.reject(
              "UNSUPPORTED_IMAGE_FORMAT_ERROR",
              e.message,
            )
          }

          else -> {
            promise.reject(
              "IMAGE_PROCESSING_FAILED_ERROR",
              e.message ?: "Barcode scanning failed",
            )
          }
        }
      } finally {
        val imageFile = resolvedImage?.file
        if (resolvedImage?.shouldDelete == true && imageFile != null && imageFile.exists()) {
          imageFile.delete()
        }
      }
    }
  }

  private data class ResolvedImage(
    val file: File,
    val shouldDelete: Boolean,
  )

  private fun resolveImage(path: String): ResolvedImage {
    val uri = path.toUri()
    return when (uri.scheme) {
      "content" -> ResolvedImage(copyContentToCache(uri), true)
      "file" -> ResolvedImage(File(uri.path ?: path), false)
      null -> ResolvedImage(File(path), false)
      else -> ResolvedImage(File(path), false)
    }
  }

  private fun copyContentToCache(uri: Uri): File {
    val cacheFile = File(reactContext.cacheDir, "mlkit_${System.currentTimeMillis()}.tmp")
    val inputStream =
      reactContext.contentResolver.openInputStream(uri)
        ?: throw IllegalArgumentException("Unable to open content URI: $uri")
    inputStream.use { input ->
      FileOutputStream(cacheFile).use { output ->
        input.copyTo(output)
      }
    }
    return cacheFile
  }

  private fun parseImageOptions(options: ReadableMap): ImagePreprocessingOptions =
    ImagePreprocessingOptions(
      invertColors = options.getOrDefault("invertColors", false),
      orientation = options.getString("orientation")?.let { parseOrientation(it) },
      scaleFactor = options.getOrDefault("scaleFactor", 1.0f),
    )

  private fun parseBarcodeOptions(options: ReadableMap): BarcodeScanningOptions =
    BarcodeScanningOptions(
      formats = BarcodeScanningOptionParser.parseFormats(options),
      enableAllPotentialBarcodes =
        BarcodeScanningOptionParser.parseEnableAllPotentialBarcodes(
          options,
        ),
    )

  private fun parseOrientation(orientation: String): Orientation? =
    when (orientation) {
      "portrait" -> Orientation.PORTRAIT
      "portrait-upside-down" -> Orientation.PORTRAIT_UPSIDE_DOWN
      "landscape-left" -> Orientation.LANDSCAPE_LEFT
      "landscape-right" -> Orientation.LANDSCAPE_RIGHT
      else -> null
    }

  private fun ReadableMap.getOrDefault(
    key: String,
    defaultValue: Boolean,
  ): Boolean {
    if (!hasKey(key) || isNull(key)) {
      return defaultValue
    }
    return getBoolean(key)
  }

  private fun ReadableMap.getOrDefault(
    key: String,
    defaultValue: Float,
  ): Float {
    if (!hasKey(key) || isNull(key)) {
      return defaultValue
    }
    return getDouble(key).toFloat()
  }
}
