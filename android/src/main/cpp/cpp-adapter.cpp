#include "VisionCameraMLKitOnLoad.hpp"
#include "JHybridBarcodeScannerSpec.hpp"
#include "JHybridTextRecognizerSpec.hpp"
#include "JHybridVisionCameraMLKitSpec.hpp"
#include <fbjni/fbjni.h>
#include <jni.h>
#include <NitroModules/HybridObjectRegistry.hpp>

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::visioncameramlkit::registerAllNatives();
  });
}

namespace margelo::nitro::visioncameramlkit {

struct JHybridVisionCameraMLKitSpecImpl:
  public facebook::jni::JavaClass<JHybridVisionCameraMLKitSpecImpl, JHybridVisionCameraMLKitSpec::JavaPart> {
  static constexpr auto kJavaDescriptor = "Lcom/margelo/nitro/visioncameramlkit/HybridVisionCameraMLKit;";

  static std::shared_ptr<JHybridVisionCameraMLKitSpec> create() {
    static const auto constructorFn = javaClassStatic()->getConstructor<JHybridVisionCameraMLKitSpecImpl::javaobject()>();
    facebook::jni::local_ref<JHybridVisionCameraMLKitSpec::JavaPart> javaPart = javaClassStatic()->newObject(constructorFn);
    return javaPart->getJHybridVisionCameraMLKitSpec();
  }
};

void registerAllNatives() {
  JHybridBarcodeScannerSpec::CxxPart::registerNatives();
  JHybridTextRecognizerSpec::CxxPart::registerNatives();
  JHybridVisionCameraMLKitSpec::CxxPart::registerNatives();

  margelo::nitro::HybridObjectRegistry::registerHybridObjectConstructor(
    "VisionCameraMLKit",
    []() -> std::shared_ptr<margelo::nitro::HybridObject> {
      return JHybridVisionCameraMLKitSpecImpl::create();
    }
  );
}

} // namespace margelo::nitro::visioncameramlkit
