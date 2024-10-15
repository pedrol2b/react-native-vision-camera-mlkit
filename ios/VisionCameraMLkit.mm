#import <Foundation/Foundation.h>
#import <VisionCamera/Frame.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("VisionCameraMLkit/VisionCameraMLkit-Swift.h")
#import "VisionCameraMLkit/VisionCameraMLkit-Swift.h"
#else
#import "VisionCameraMLkit-Swift.h"
#endif

#define REGISTER_PLUGIN(PLUGIN_CLASS, PLUGIN_NAME)                             \
  @interface PLUGIN_CLASS (FrameProcessorPluginLoader)                         \
  @end                                                                         \
                                                                               \
  @implementation PLUGIN_CLASS (FrameProcessorPluginLoader)                    \
  +(void)load {                                                                \
    [FrameProcessorPluginRegistry                                              \
        addFrameProcessorPlugin:PLUGIN_NAME                                    \
                withInitializer:^FrameProcessorPlugin *(                       \
                    VisionCameraProxyHolder * proxy, NSDictionary * options) { \
                  return [[PLUGIN_CLASS alloc] initWithProxy:proxy             \
                                                 withOptions:options];         \
                }];                                                            \
  }                                                                            \
  @end

REGISTER_PLUGIN(VisionCameraMLkitBarcodeScanningPlugin, @"barcodeScanner")

REGISTER_PLUGIN(VisionCameraMLkitImageLabelingPlugin, @"imageLabeler")

REGISTER_PLUGIN(VisionCameraMLkitObjectDetectionPlugin, @"objectDetector")

REGISTER_PLUGIN(VisionCameraMLkitTextRecognitionPlugin, @"textRecognizer")
