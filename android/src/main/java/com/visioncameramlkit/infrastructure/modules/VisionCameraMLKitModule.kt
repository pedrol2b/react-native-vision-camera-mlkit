package com.visioncameramlkit.infrastructure.modules

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.visioncameramlkit.bridge.constants.MLKitFeatureKeys
import com.visioncameramlkit.bridge.handlers.IStaticImageHandler
import com.visioncameramlkit.bridge.handlers.StaticBarcodeScanningHandler
import com.visioncameramlkit.bridge.handlers.StaticTextRecognitionHandler

@ReactModule(name = VisionCameraMLKitModule.NAME)
class VisionCameraMLKitModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "VisionCameraMLKitModule"
  }

  private val handlers by lazy {
    mapOf<String, IStaticImageHandler>(
      MLKitFeatureKeys.TEXT_RECOGNITION to StaticTextRecognitionHandler(reactApplicationContext),
      MLKitFeatureKeys.BARCODE_SCANNING to StaticBarcodeScanningHandler(reactApplicationContext),
    )
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun processImage(
    feature: String,
    path: String,
    options: ReadableMap?,
    promise: Promise,
  ) {
    val safeOptions = options ?: Arguments.createMap()
    val handler = handlers[feature]
    if (handler == null) {
      promise.reject("UNSUPPORTED_FEATURE", "Feature $feature is not supported")
      return
    }

    handler.process(path, safeOptions, promise)
  }
}
