package com.visioncameramlkit

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.visioncameramlkit.VisionCameraMLKitOnLoad
import com.visioncameramlkit.infrastructure.modules.VisionCameraMLKitModule

class VisionCameraMLKitPackage : BaseReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    when (name) {
      VisionCameraMLKitModule.NAME -> {
        VisionCameraMLKitModule(reactContext)
      }

      else -> {
        null
      }
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        VisionCameraMLKitModule.NAME to
          ReactModuleInfo(
            VisionCameraMLKitModule.NAME,
            VisionCameraMLKitModule.NAME,
            canOverrideExistingModule = false,
            needsEagerInit = false,
            isCxxModule = false,
            isTurboModule = false,
          ),
      )
    }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()

  companion object {
    init {
      VisionCameraMLKitOnLoad.initializeNative()
    }
  }
}
