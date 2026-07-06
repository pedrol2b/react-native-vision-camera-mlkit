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

    func preprocessFrame(frame: any HybridFrameSpec, options: ImagePreprocessingOptions)
      -> ProcessedImage?
    {
      guard
        let nativeFrame = frame as? NativeFrame,
        let sampleBuffer = nativeFrame.sampleBuffer
      else {
        return nil
      }

      let effectiveScale = clampScale(options.scaleFactor)
      let frameOrientation = frame.orientation.asUIImageOrientation

      let image: VisionImage

      if options.invertColors {
        guard
          let invertedImage = createInvertedVisionImageFromFrame(
            sampleBuffer: sampleBuffer,
            frameOrientation: frameOrientation,
            outputOrientation: options.outputOrientation,
            scaleFactor: effectiveScale
          )
        else {
          return nil
        }
        image = invertedImage
      } else {
        image = createVisionImageFromFrame(
          sampleBuffer: sampleBuffer,
          frameOrientation: frameOrientation,
          outputOrientation: options.outputOrientation,
          scaleFactor: effectiveScale
        )
      }

      guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
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
        orientation: frameOrientation,
        isInverted: options.invertColors
      )

      return ProcessedImage(image: image, metadata: metadata)
    }

    private func createVisionImageFromFrame(
      sampleBuffer: CMSampleBuffer,
      frameOrientation: UIImage.Orientation,
      outputOrientation: OutputOrientation?,
      scaleFactor: CGFloat
    ) -> VisionImage {
      // MLKit works more reliably when frames are converted to UIImage
      // YUV CMSampleBuffer can have orientation and format handling issues
      if let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) {
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
            frameOrientation: frameOrientation,
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
      let image = VisionImage(buffer: sampleBuffer)
      image.orientation = getVisionOrientation(
        frameOrientation: frameOrientation,
        outputOrientation: outputOrientation
      )
      return image
    }

    private func createInvertedVisionImageFromFrame(
      sampleBuffer: CMSampleBuffer,
      frameOrientation: UIImage.Orientation,
      outputOrientation: OutputOrientation?,
      scaleFactor: CGFloat
    ) -> VisionImage? {
      guard let buffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
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
        frameOrientation: frameOrientation,
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

      // Use user-provided orientation override when available.
      // Otherwise use the resulting UIImage orientation after processing.
      let requestedOrientation = options.orientation?.asUIImageOrientation
      let effectiveScale = clampScale(options.scaleFactor)

      var processedImage = uiImage

      // Apply optional downscale for static images.
      if effectiveScale < 1.0 {
        processedImage = scaleUIImage(processedImage, scaleFactor: effectiveScale)
      }

      // Apply color inversion if needed
      if options.invertColors {
        processedImage = invertUIImageColors(processedImage)
      }

      // Create VisionImage
      let visionImage = VisionImage(image: processedImage)
      let visionOrientation = requestedOrientation ?? processedImage.imageOrientation
      visionImage.orientation = visionOrientation

      let pixelWidth =
        processedImage.cgImage?.width
        ?? Int(processedImage.size.width * processedImage.scale)
      let pixelHeight =
        processedImage.cgImage?.height
        ?? Int(processedImage.size.height * processedImage.scale)

      let metadata = ImageMetadata(
        width: pixelWidth,
        height: pixelHeight,
        orientation: visionOrientation,
        isInverted: options.invertColors
      )

      return ProcessedImage(image: visionImage, metadata: metadata)
    }

    private func scaleUIImage(_ image: UIImage, scaleFactor: CGFloat) -> UIImage {
      let targetSize = CGSize(
        width: image.size.width * scaleFactor,
        height: image.size.height * scaleFactor
      )

      let rendererFormat = UIGraphicsImageRendererFormat.default()
      rendererFormat.scale = image.scale

      let renderer = UIGraphicsImageRenderer(size: targetSize, format: rendererFormat)
      return renderer.image { _ in
        image.draw(in: CGRect(origin: .zero, size: targetSize))
      }
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
