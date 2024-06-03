package com.visioncameramlkit

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import com.visioncameramlkit.plugins.VisionCameraMLkitBarcodeScanningPlugin
import com.visioncameramlkit.plugins.VisionCameraMLkitImageLabelingPlugin
import com.visioncameramlkit.plugins.VisionCameraMLkitObjectDetectionPlugin
import com.visioncameramlkit.plugins.VisionCameraMLkitTextRecognitionPlugin

class VisionCameraMLkitPackage : ReactPackage {
    companion object {
        init {
            FrameProcessorPluginRegistry.addFrameProcessorPlugin("barcodeScanner") { proxy, options ->
                VisionCameraMLkitBarcodeScanningPlugin(proxy, options)
            }

            FrameProcessorPluginRegistry.addFrameProcessorPlugin("imageLabeler") { proxy, options ->
                VisionCameraMLkitImageLabelingPlugin(proxy, options)
            }

            FrameProcessorPluginRegistry.addFrameProcessorPlugin("objectDetector") { proxy, options ->
                VisionCameraMLkitObjectDetectionPlugin(proxy, options)
            }

            FrameProcessorPluginRegistry.addFrameProcessorPlugin("textRecognizer") { proxy, options ->
                VisionCameraMLkitTextRecognitionPlugin(proxy, options)
            }
        }
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
