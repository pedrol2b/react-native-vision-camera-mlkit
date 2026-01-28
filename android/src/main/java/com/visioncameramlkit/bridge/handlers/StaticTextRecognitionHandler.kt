package com.visioncameramlkit.bridge.handlers

import android.net.Uri
import androidx.core.net.toUri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.visioncameramlkit.application.usecases.RecognizeTextUseCase
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.Orientation
import com.visioncameramlkit.domain.models.TextRecognitionLanguage
import com.visioncameramlkit.domain.models.TextRecognitionOptions
import com.visioncameramlkit.infrastructure.image.ImagePreprocessor
import com.visioncameramlkit.infrastructure.mlkit.factories.TextRecognitionServiceFactory
import com.visioncameramlkit.infrastructure.serializers.TextRecognitionSerializer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

class StaticTextRecognitionHandler(
  private val reactContext: ReactApplicationContext,
) : IStaticImageHandler {
  private var cachedUseCase: RecognizeTextUseCase? = null

  private fun getRecognizeTextUseCase(language: TextRecognitionLanguage): RecognizeTextUseCase {
    if (cachedUseCase != null) {
      return cachedUseCase!!
    }
    val recognitionService = TextRecognitionServiceFactory.create(language)
    val newUseCase =
      RecognizeTextUseCase(
        ImagePreprocessor(),
        recognitionService,
      )
    cachedUseCase = newUseCase
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

        // Parse options
        val imageOptions = parseImageOptions(options)

        // Create text recognition options
        val languageString = options.getString("language") ?: "LATIN"
        val language = parseLanguage(languageString)
        val textOptions = TextRecognitionOptions(language = language)

        // Get use case for the language
        val recognizeTextUseCase = getRecognizeTextUseCase(language)

        // Process the image
        val result =
          recognizeTextUseCase.execute(
            imageFile,
            imageOptions,
            textOptions,
          )

        // Serialize result
        val serializedResult = TextRecognitionSerializer.toWritableMap(result)

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
              e.message ?: "Text recognition failed",
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

  private fun parseOrientation(orientation: String): Orientation =
    when (orientation) {
      "portrait" -> Orientation.PORTRAIT
      "portrait-upside-down" -> Orientation.PORTRAIT_UPSIDE_DOWN
      "landscape-left" -> Orientation.LANDSCAPE_LEFT
      "landscape-right" -> Orientation.LANDSCAPE_RIGHT
      else -> Orientation.PORTRAIT
    }

  private fun parseLanguage(language: String): TextRecognitionLanguage =
    when (language) {
      "LATIN" -> TextRecognitionLanguage.LATIN
      "CHINESE" -> TextRecognitionLanguage.CHINESE
      "DEVANAGARI" -> TextRecognitionLanguage.DEVANAGARI
      "JAPANESE" -> TextRecognitionLanguage.JAPANESE
      "KOREAN" -> TextRecognitionLanguage.KOREAN
      else -> TextRecognitionLanguage.LATIN
    }
}
