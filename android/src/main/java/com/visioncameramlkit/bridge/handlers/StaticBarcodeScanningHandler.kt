package com.visioncameramlkit.bridge.handlers

import android.net.Uri
import androidx.core.net.toUri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.visioncameramlkit.application.usecases.RecognizeBarcodeUseCase
import com.visioncameramlkit.domain.models.BarcodeFormatOption
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
  private var cachedUseCase: RecognizeBarcodeUseCase? = null
  private var cachedOptionsKey: String? = null

  private fun getRecognizeBarcodeUseCase(options: BarcodeScanningOptions): RecognizeBarcodeUseCase {
    val optionsKey = buildOptionsKey(options)
    if (cachedUseCase != null && cachedOptionsKey == optionsKey) {
      return cachedUseCase!!
    }

    val recognitionService = BarcodeScanningServiceFactory.create(options)
    val newUseCase =
      RecognizeBarcodeUseCase(
        ImagePreprocessor(),
        recognitionService,
      )
    cachedUseCase = newUseCase
    cachedOptionsKey = optionsKey
    return newUseCase
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
        val recognizeBarcodeUseCase = getRecognizeBarcodeUseCase(barcodeOptions)

        val result =
          recognizeBarcodeUseCase.execute(
            imageFile,
            imageOptions,
            barcodeOptions,
          )

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
      invertColors = options.getBoolean("invertColors"),
      orientation =
        options.getString("orientation")?.let { parseOrientation(it) }
          ?: Orientation.PORTRAIT,
    )

  private fun parseBarcodeOptions(options: ReadableMap): BarcodeScanningOptions {
    val formatStrings = parseFormats(options.getArray("formats"))
    val enableAllPotentialBarcodes =
      if (options.hasKey("enableAllPotentialBarcodes")) {
        options.getBoolean("enableAllPotentialBarcodes")
      } else {
        false
      }

    return BarcodeScanningOptions(
      formats = formatStrings,
      enableAllPotentialBarcodes = enableAllPotentialBarcodes,
    )
  }

  private fun parseFormats(rawFormats: ReadableArray?): List<BarcodeFormatOption> {
    if (rawFormats == null || rawFormats.size() == 0) {
      return listOf(BarcodeFormatOption.ALL)
    }

    val parsed = mutableListOf<BarcodeFormatOption>()
    for (index in 0 until rawFormats.size()) {
      val rawValue = rawFormats.getString(index)?.uppercase()
      val format = rawValue?.let { toBarcodeFormat(it) }
      if (format != null) {
        parsed.add(format)
      }
    }

    return if (parsed.isEmpty()) {
      listOf(BarcodeFormatOption.ALL)
    } else {
      parsed
    }
  }

  private fun parseOrientation(orientation: String): Orientation =
    when (orientation) {
      "portrait" -> Orientation.PORTRAIT
      "portrait-upside-down" -> Orientation.PORTRAIT_UPSIDE_DOWN
      "landscape-left" -> Orientation.LANDSCAPE_LEFT
      "landscape-right" -> Orientation.LANDSCAPE_RIGHT
      else -> Orientation.PORTRAIT
    }

  private fun toBarcodeFormat(rawValue: String): BarcodeFormatOption? =
    try {
      BarcodeFormatOption.valueOf(rawValue)
    } catch (
      @Suppress("SwallowedException") _: IllegalArgumentException,
    ) {
      null
    }

  private fun buildOptionsKey(options: BarcodeScanningOptions): String {
    val formatsKey =
      options.formats
        .map { it.name }
        .sorted()
        .joinToString(",")
    return "$formatsKey|${options.enableAllPotentialBarcodes}"
  }
}
