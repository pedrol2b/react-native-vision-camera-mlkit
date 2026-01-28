package com.visioncameramlkit.bridge.registry

import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import com.visioncameramlkit.BuildConfig
import com.visioncameramlkit.bridge.constants.MLKitFeatureKeys

object PluginRegistry {
  private val isRegistered by lazy {
    registerPlugins()
    true
  }

  fun ensureRegistered() {
    isRegistered
  }

  private fun registerPlugins() {
    @Suppress("KotlinConstantConditions")
    if (BuildConfig.MLKIT_TEXT_RECOGNITION) {
      registerTextRecognitionPlugin()
    }
  }

  private fun registerTextRecognitionPlugin() {
    try {
      // Dynamically load the plugin class to avoid compilation errors
      // when the MLKit dependencies are not included
      val pluginClass =
        Class.forName("com.visioncameramlkit.bridge.plugins.TextRecognitionPlugin")

      FrameProcessorPluginRegistry.addFrameProcessorPlugin(
        MLKitFeatureKeys.TEXT_RECOGNITION,
      ) { proxy, options ->
        val constructor =
          pluginClass.getConstructor(
            com.mrousavy.camera.frameprocessors.VisionCameraProxy::class.java,
            Map::class.java,
          )
        constructor.newInstance(
          proxy,
          options,
        ) as com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
      }
    } catch (e: ClassNotFoundException) {
      // Plugin class not found - feature not enabled
      android.util.Log.w("VisionCameraMLKit", "TextRecognitionPlugin not available: ${e.message}")
    } catch (
      @Suppress("TooGenericExceptionCaught") e: Exception,
    ) {
      android.util.Log.e("VisionCameraMLKit", "Error registering TextRecognitionPlugin", e)
    }
  }
}
