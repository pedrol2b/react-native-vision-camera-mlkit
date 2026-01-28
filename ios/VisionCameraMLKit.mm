#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <VisionCamera/Frame.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("VisionCameraMLKit/VisionCameraMLKit-Swift.h")
#import "VisionCameraMLKit/VisionCameraMLKit-Swift.h"
#else
#import "VisionCameraMLKit-Swift.h"
#endif

@interface RCT_EXTERN_MODULE (VisionCameraMLKitModule, NSObject)
RCT_EXTERN_METHOD(processImage : (NSString *)feature path : (
    NSString *)path options : (id)options resolver : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)
@end

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

#ifdef MLKIT_TEXT_RECOGNITION
REGISTER_PLUGIN(TextRecognitionPlugin, @"TextRecognition")
#endif
