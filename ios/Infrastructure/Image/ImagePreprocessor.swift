import Foundation

#if canImport(MLKitVision) && canImport(VisionCamera)
  import MLKitVision
  import VisionCamera

  class ImagePreprocessor: IImagePreprocessor {

    // Reuse CIContext across frames to avoid repeated allocation overhead
    // CIContext creation is expensive (~10-20ms), reusing reduces per-frame cost significantly
    private static let sharedContext: CIContext = {
      // Use Metal if available for better performance, otherwise use CPU
      if let metalDevice = MTLCreateSystemDefaultDevice() {
        return CIContext(
          mtlDevice: metalDevice,
          options: [.useSoftwareRenderer: false]
        )
      } else {
        return CIContext(options: [.useSoftwareRenderer: false])
      }
    }()

    // Clamp scaleFactor to safe range for ML accuracy
    private func clampScale(_ scaleFactor: CGFloat?) -> CGFloat {
      let scale = scaleFactor ?? 1.0
      return min(max(scale, 0.9), 1.0)
    }

    // Create scaled VisionImage from CIImage using Core Image affine transform
    private func createScaledVisionImage(
      from ciImage: CIImage,
      scaleFactor: CGFloat,
      frameOrientation: UIImage.Orientation,
      outputOrientation: OutputOrientation?
    ) -> VisionImage? {
      // Apply scaling using CIAffineTransform
      let scaledCIImage = ciImage.transformed(
        by: CGAffineTransform(scaleX: scaleFactor, y: scaleFactor)
      )

      // Render to CGImage
      guard
        let cgImage = ImagePreprocessor.sharedContext.createCGImage(
          scaledCIImage,
          from: scaledCIImage.extent
        )
      else {
        return nil
      }

      // Create UIImage with .up orientation (orientation handled by VisionImage)
      let uiImage = UIImage(
        cgImage: cgImage,
        scale: 1.0,
        orientation: .up
      )

      let visionImage = VisionImage(image: uiImage)
      visionImage.orientation = getVisionOrientation(
        frameOrientation: frameOrientation,
        outputOrientation: outputOrientation
      )
      return visionImage
    }

    // Create filter per call to avoid threading issues with shared state
    // CIFilter is not thread-safe; creating per-call ensures safe concurrent frame processing
    private func createColorInvertFilter() -> CIFilter? {
      let filter = CIFilter(name: "CIColorInvert")
      filter?.setDefaults()
      return filter
    }

    func preprocessFrame(frame: Frame, options: ImagePreprocessingOptions)
      -> ProcessedImage?
    {
      let effectiveScale = clampScale(options.scaleFactor)

      let image: VisionImage

      if options.invertColors {
        guard
          let invertedImage = createInvertedVisionImageFromFrame(
            frame: frame,
            outputOrientation: options.outputOrientation,
            scaleFactor: effectiveScale
          )
        else {
          return nil
        }
        image = invertedImage
      } else {
        image = createVisionImageFromFrame(
          frame: frame,
          outputOrientation: options.outputOrientation,
          scaleFactor: effectiveScale
        )
      }

      let buffer: CMSampleBuffer = frame.buffer
      guard let imageBuffer = CMSampleBufferGetImageBuffer(buffer) else {
        return nil
      }

      // Use scaled dimensions for metadata
      let originalWidth = CVPixelBufferGetWidth(imageBuffer)
      let originalHeight = CVPixelBufferGetHeight(imageBuffer)
      let width = Int(CGFloat(originalWidth) * effectiveScale)
      let height = Int(CGFloat(originalHeight) * effectiveScale)

      let metadata = ImageMetadata(
        width: width,
        height: height,
        orientation: frame.orientation,
        isInverted: options.invertColors
      )

      return ProcessedImage(image: image, metadata: metadata)
    }

    private func createVisionImageFromFrame(
      frame: Frame,
      outputOrientation: OutputOrientation?,
      scaleFactor: CGFloat
    ) -> VisionImage {
      let buffer: CMSampleBuffer = frame.buffer

      // MLKit works more reliably when frames are converted to UIImage
      // YUV CMSampleBuffer can have orientation and format handling issues
      if let pixelBuffer = CMSampleBufferGetImageBuffer(buffer) {
        let pixelFormatType = CVPixelBufferGetPixelFormatType(pixelBuffer)

        // Only use BGRA directly with MLKit - convert everything else
        // YUV formats can have issues with CMSampleBuffer, so convert to BGRA for reliability
        let needsConversion =
          pixelFormatType != kCVPixelFormatType_32BGRA
          || pixelFormatType
            == kCVPixelFormatType_Lossy_420YpCbCr8BiPlanarVideoRange
          || pixelFormatType
            == kCVPixelFormatType_Lossy_420YpCbCr8BiPlanarFullRange
          || pixelFormatType
            == kCVPixelFormatType_Lossless_420YpCbCr8BiPlanarVideoRange
          || pixelFormatType
            == kCVPixelFormatType_Lossless_420YpCbCr8BiPlanarFullRange

        // Force conversion when scaling is needed to ensure consistent behavior
        // Never bypass scaling if scaleFactor < 1.0
        if needsConversion || scaleFactor < 1.0 {
          if let convertedImage = convertToSupportedFormat(
            pixelBuffer: pixelBuffer,
            frameOrientation: frame.orientation,
            outputOrientation: outputOrientation,
            scaleFactor: scaleFactor
          ) {
            return convertedImage
          }
          // Conversion failed - this should not happen for scaling cases
          fatalError("Conversion failed when scaling is required")
        }
      }

      // Fallback: Use CMSampleBuffer directly (for BGRA and scaleFactor == 1.0)
      let image = VisionImage(buffer: buffer)
      image.orientation = getVisionOrientation(
        frameOrientation: frame.orientation,
        outputOrientation: outputOrientation
      )
      return image
    }

    private func createInvertedVisionImageFromFrame(
      frame: Frame,
      outputOrientation: OutputOrientation?,
      scaleFactor: CGFloat
    ) -> VisionImage? {
      guard let buffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
        return nil
      }

      let ciImage = CIImage(cvPixelBuffer: buffer)

      guard let invertedCIImage = invertCIImageColor(image: ciImage) else {
        return nil
      }

      // Apply scaling and create VisionImage using the new method
      return createScaledVisionImage(
        from: invertedCIImage,
        scaleFactor: scaleFactor,
        frameOrientation: frame.orientation,
        outputOrientation: outputOrientation
      )
    }

    private func getVisionOrientation(
      frameOrientation: UIImage.Orientation,
      outputOrientation: OutputOrientation?
    )
      -> UIImage.Orientation
    {
      if let outputOrientation = outputOrientation {
        return outputOrientation.asUIImageOrientation
      }
      // Remap for iOS camera sensor orientation quirks when no outputOrientation provided.
      switch frameOrientation {
      case .left:
        return .right
      case .right:
        return .left
      default:
        return frameOrientation
      }
    }

    private func invertCIImageColor(image: CIImage) -> CIImage? {
      guard let filter = createColorInvertFilter() else { return nil }
      filter.setValue(image, forKey: kCIInputImageKey)
      return filter.outputImage
    }

    private func convertToSupportedFormat(
      pixelBuffer: CVPixelBuffer,
      frameOrientation: UIImage.Orientation,
      outputOrientation: OutputOrientation?,
      scaleFactor: CGFloat
    ) -> VisionImage? {
      // Convert to CIImage
      let ciImage = CIImage(cvPixelBuffer: pixelBuffer)

      // Apply scaling and create VisionImage using the new method
      return createScaledVisionImage(
        from: ciImage,
        scaleFactor: scaleFactor,
        frameOrientation: frameOrientation,
        outputOrientation: outputOrientation
      )
    }

    func preprocessImage(imageFile: URL, options: ImagePreprocessingOptions)
      -> ProcessedImage?
    {
      guard let imageData = try? Data(contentsOf: imageFile),
        let uiImage = UIImage(data: imageData)
      else {
        return nil
      }

      // Rotate image based on orientation
      let rotatedImage = rotateUIImage(uiImage, orientation: options.orientation)

      // Apply color inversion if needed
      let processedImage: UIImage
      if options.invertColors {
        processedImage = invertUIImageColors(rotatedImage)
      } else {
        processedImage = rotatedImage
      }

      // Create VisionImage
      let visionImage = VisionImage(image: processedImage)
      visionImage.orientation = options.orientation.asUIImageOrientation

      let metadata = ImageMetadata(
        width: Int(processedImage.size.width),
        height: Int(processedImage.size.height),
        orientation: options.orientation.asUIImageOrientation,
        isInverted: options.invertColors
      )

      return ProcessedImage(image: visionImage, metadata: metadata)
    }

    private func rotateUIImage(_ image: UIImage, orientation: Orientation)
      -> UIImage
    {
      let degrees: CGFloat
      switch orientation {
      case .portrait:
        degrees = 0
      case .portraitUpsideDown:
        degrees = 180
      case .landscapeLeft:
        degrees = 90
      case .landscapeRight:
        degrees = 270
      }

      let radians = degrees * .pi / 180
      let rotatedSize = CGRect(origin: .zero, size: image.size)
        .applying(CGAffineTransform(rotationAngle: radians))
        .integral

      UIGraphicsBeginImageContext(rotatedSize.size)
      defer { UIGraphicsEndImageContext() }

      guard let context = UIGraphicsGetCurrentContext() else { return image }

      context.translateBy(
        x: rotatedSize.size.width / 2,
        y: rotatedSize.size.height / 2
      )
      context.rotate(by: radians)
      image.draw(
        in: CGRect(
          x: -image.size.width / 2,
          y: -image.size.height / 2,
          width: image.size.width,
          height: image.size.height
        )
      )

      return UIGraphicsGetImageFromCurrentImageContext() ?? image
    }

    private func invertUIImageColors(_ image: UIImage) -> UIImage {
      guard let filter = createColorInvertFilter(),
        let ciImage = CIImage(image: image)
      else {
        return image
      }

      filter.setValue(ciImage, forKey: kCIInputImageKey)
      guard let outputImage = filter.outputImage,
        let cgImage = ImagePreprocessor.sharedContext.createCGImage(
          outputImage,
          from: outputImage.extent
        )
      else {
        return image
      }

      return UIImage(cgImage: cgImage)
    }
  }
#endif
