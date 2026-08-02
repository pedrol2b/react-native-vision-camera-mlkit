import Foundation

#if canImport(VisionCamera)
  import VisionCamera

  protocol IImagePreprocessor {
    func preprocessFrame(frame: any HybridFrameSpec, options: ImagePreprocessingOptions)
      -> ProcessedImage?

    func preprocessImage(imageFile: URL, options: ImagePreprocessingOptions)
      -> ProcessedImage?
  }
#endif
