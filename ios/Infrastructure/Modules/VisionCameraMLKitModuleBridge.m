#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VisionCameraMLKitModule, NSObject)

RCT_EXTERN_METHOD(processImage:(NSString *)feature
                              path:(NSString *)path
                           options:(id)options
                          resolver:(RCTPromiseResolveBlock)resolve
                          rejecter:(RCTPromiseRejectBlock)reject)

@end
