#import <Foundation/Foundation.h>
#import <VisionCamera/Frame.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#define REGISTER_PLUGIN(pluginClass, pluginName)                               \
  @interface pluginClass (FrameProcessorPluginLoader)                          \
  @end                                                                         \
  @implementation pluginClass (FrameProcessorPluginLoader)                     \
  +(void)load {                                                                \
    [FrameProcessorPluginRegistry                                              \
        addFrameProcessorPlugin:pluginName                                     \
                withInitializer:^FrameProcessorPlugin *(                       \
                    VisionCameraProxyHolder * proxy, NSDictionary * options) { \
                  return [[pluginClass alloc] initWithProxy:proxy              \
                                                withOptions:options];          \
                }];                                                            \
  }                                                                            \
  @end

#if __has_include(                                                             \
    "VisionCameraMLkit/VisionCameraMLkitBarcodeScanningPlugin-Swift.h")
#import "VisionCameraMLkit/VisionCameraMLkitBarcodeScanningPlugin-Swift.h"
#else
#import "VisionCameraMLkitBarcodeScanningPlugin-Swift.h"
#endif
REGISTER_PLUGIN(VisionCameraMLkitBarcodeScanningPlugin, @"barcodeScanner")

#if __has_include(                                                             \
    "VisionCameraMLkit/VisionCameraMLkitImageLabelingPlugin-Swift.h")
#import "VisionCameraMLkit/VisionCameraMLkitImageLabelingPlugin-Swift.h"
#else
#import "VisionCameraMLkitImageLabelingPlugin-Swift.h"
#endif
REGISTER_PLUGIN(VisionCameraMLkitImageLabelingPlugin, @"imageLabeler")

#if __has_include(                                                             \
    "VisionCameraMLkit/VisionCameraMLkitObjectDetectionPlugin-Swift.h")
#import "VisionCameraMLkit/VisionCameraMLkitObjectDetectionPlugin-Swift.h"
#else
#import "VisionCameraMLkitObjectDetectionPlugin-Swift.h"
#endif
REGISTER_PLUGIN(VisionCameraMLkitObjectDetectionPlugin, @"objectDetector")

#if __has_include(                                                             \
    "VisionCameraMLkit/VisionCameraMLkitTextRecognitionPlugin-Swift.h")
#import "VisionCameraMLkit/VisionCameraMLkitTextRecognitionPlugin-Swift.h"
#else
#import "VisionCameraMLkitTextRecognitionPlugin-Swift.h"
#endif
REGISTER_PLUGIN(VisionCameraMLkitTextRecognitionPlugin, @"textRecognizer")
