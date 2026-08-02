import Foundation
import ImageIO

#if canImport(MLKitVision) && canImport(VisionCamera)
  import MLKitVision
  import VisionCamera

  class ImagePreprocessor: IImagePreprocessor {

    private struct DecodedStaticImage {
      let image: UIImage
      let sourceScaleFactor: CGFloat
    }

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

    // Create scaled VisionImage from CIImage using Core Image affine transform.
    // Crop happens before scale, matching the static-image pipeline's crop-then-scale order.
    private func createScaledVisionImage(
      from ciImage: CIImage,
      scaleFactor: CGFloat,
      visionOrientation: UIImage.Orientation,
      roi: DomainRegionOfInterest?
    ) -> VisionImage? {
      var workingImage = ciImage

      if let roi = roi {
        guard (try? roi.validate()) != nil else {
          return nil
        }
        let extent = workingImage.extent
        let pixelRect = roi.resolvedPixelRect(
          imageWidth: extent.width,
          imageHeight: extent.height
        )
        // CIImage's coordinate origin is at the extent's origin (not necessarily .zero),
        // so the crop rect must be offset into the image's own coordinate space.
        let cropRect = pixelRect.offsetBy(dx: extent.minX, dy: extent.minY)
        workingImage = workingImage.cropped(to: cropRect)
      }

      // Apply scaling using CIAffineTransform
      let scaledCIImage = workingImage.transformed(
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
      visionImage.orientation = visionOrientation
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
      let visionOrientation = resolveVisionOrientation(
        frameOrientation: frameOrientation,
        outputOrientation: options.outputOrientation
      )

      if let roi = options.roi {
        guard (try? roi.validate()) != nil else {
          return nil
        }
      }

      let image: VisionImage

      if options.invertColors {
        guard
          let invertedImage = createInvertedVisionImageFromFrame(
            sampleBuffer: sampleBuffer,
            visionOrientation: visionOrientation,
            scaleFactor: effectiveScale,
            roi: options.roi
          )
        else {
          return nil
        }
        image = invertedImage
      } else {
        guard
          let convertedImage = createVisionImageFromFrame(
            sampleBuffer: sampleBuffer,
            visionOrientation: visionOrientation,
            scaleFactor: effectiveScale,
            roi: options.roi
          )
        else {
          return nil
        }
        image = convertedImage
      }

      guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
        return nil
      }

      // Use pre-crop, pre-scale pixel-buffer dimensions to resolve the ROI's pixel rect so the
      // crop offset lands in the same coordinate space as the scaled width/height below.
      let originalWidth = CGFloat(CVPixelBufferGetWidth(imageBuffer))
      let originalHeight = CGFloat(CVPixelBufferGetHeight(imageBuffer))

      var offsetX: CGFloat = 0
      var offsetY: CGFloat = 0
      var croppedWidth = originalWidth
      var croppedHeight = originalHeight

      if let roi = options.roi {
        let pixelRect = roi.resolvedPixelRect(
          imageWidth: originalWidth,
          imageHeight: originalHeight
        )
        offsetX = pixelRect.origin.x
        offsetY = pixelRect.origin.y
        croppedWidth = pixelRect.width
        croppedHeight = pixelRect.height
      }

      // Use scaled dimensions for metadata
      let width = Int(croppedWidth * effectiveScale)
      let height = Int(croppedHeight * effectiveScale)

      let metadata = ImageMetadata(
        width: width,
        height: height,
        orientation: visionOrientation,
        isInverted: options.invertColors,
        offsetX: offsetX,
        offsetY: offsetY,
        scaleFactor: effectiveScale
      )

      return ProcessedImage(image: image, metadata: metadata)
    }

    private func createVisionImageFromFrame(
      sampleBuffer: CMSampleBuffer,
      visionOrientation: UIImage.Orientation,
      scaleFactor: CGFloat,
      roi: DomainRegionOfInterest?
    ) -> VisionImage? {
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

        // Force conversion when scaling or an ROI crop is needed to ensure consistent behavior.
        // Never bypass scaling/cropping if scaleFactor < 1.0 or an ROI is set, since the raw
        // CMSampleBuffer fast path below cannot crop.
        if needsConversion || scaleFactor < 1.0 || roi != nil {
          guard
            let convertedImage = convertToSupportedFormat(
              pixelBuffer: pixelBuffer,
              visionOrientation: visionOrientation,
              scaleFactor: scaleFactor,
              roi: roi
            )
          else {
            // Conversion failed - this should not happen for scaling/cropping cases
            return nil
          }
          return convertedImage
        }
      }

      // Fallback: Use CMSampleBuffer directly (for BGRA, scaleFactor == 1.0, and no ROI)
      let image = VisionImage(buffer: sampleBuffer)
      image.orientation = visionOrientation
      return image
    }

    private func createInvertedVisionImageFromFrame(
      sampleBuffer: CMSampleBuffer,
      visionOrientation: UIImage.Orientation,
      scaleFactor: CGFloat,
      roi: DomainRegionOfInterest?
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
        visionOrientation: visionOrientation,
        roi: roi
      )
    }

    private func resolveVisionOrientation(
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
      visionOrientation: UIImage.Orientation,
      scaleFactor: CGFloat,
      roi: DomainRegionOfInterest?
    ) -> VisionImage? {
      // Convert to CIImage
      let ciImage = CIImage(cvPixelBuffer: pixelBuffer)

      // Apply scaling and create VisionImage using the new method
      return createScaledVisionImage(
        from: ciImage,
        scaleFactor: scaleFactor,
        visionOrientation: visionOrientation,
        roi: roi
      )
    }

    func preprocessImage(imageFile: URL, options: ImagePreprocessingOptions)
      -> ProcessedImage?
    {
      guard
        let decoded = decodeStaticImage(
          imageFile,
          explicitOrientation: options.orientation?.asUIImageOrientation
        )
      else {
        return nil
      }

      // An explicit orientation describes the source pixels and overrides embedded EXIF.
      // Normalize either orientation into pixels before resolving ROI coordinates.
      let effectiveOrientation =
        options.orientation?.asUIImageOrientation ?? decoded.image.imageOrientation
      guard let normalizedImage = decoded.image.normalized(to: effectiveOrientation) else {
        return nil
      }
      let effectiveScale = clampScale(options.scaleFactor)

      var processedImage = normalizedImage
      var offsetX: CGFloat = 0
      var offsetY: CGFloat = 0

      // Apply optional ROI crop in normalized, visually oriented pixel coordinates.
      if let roi = options.roi {
        guard (try? roi.validate()) != nil else {
          return nil
        }

        // Crop in the same pixel space ML Kit will see: the CGImage's pixel dimensions,
        // not the orientation-aware `image.size`.
        guard let cgImage = processedImage.cgImage else {
          return nil
        }

        let pixelRect = roi.resolvedPixelRect(
          imageWidth: CGFloat(cgImage.width),
          imageHeight: CGFloat(cgImage.height)
        )

        guard let croppedCGImage = cgImage.cropping(to: pixelRect) else {
          return nil
        }

        offsetX = pixelRect.origin.x / decoded.sourceScaleFactor
        offsetY = pixelRect.origin.y / decoded.sourceScaleFactor
        processedImage = UIImage(
          cgImage: croppedCGImage,
          scale: processedImage.scale,
          orientation: .up
        )
      }

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
      visionImage.orientation = .up

      let pixelWidth =
        processedImage.cgImage?.width
        ?? Int(processedImage.size.width * processedImage.scale)
      let pixelHeight =
        processedImage.cgImage?.height
        ?? Int(processedImage.size.height * processedImage.scale)

      let metadata = ImageMetadata(
        width: pixelWidth,
        height: pixelHeight,
        orientation: .up,
        isInverted: options.invertColors,
        offsetX: offsetX,
        offsetY: offsetY,
        scaleFactor: decoded.sourceScaleFactor * effectiveScale
      )

      return ProcessedImage(image: visionImage, metadata: metadata)
    }

    private func decodeStaticImage(
      _ imageFile: URL,
      explicitOrientation: UIImage.Orientation?
    ) -> DecodedStaticImage? {
      guard
        let source = CGImageSourceCreateWithURL(imageFile as CFURL, nil),
        let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil)
          as? [CFString: Any],
        let width = properties[kCGImagePropertyPixelWidth] as? Int,
        let height = properties[kCGImagePropertyPixelHeight] as? Int,
        let decodePlan = StaticImageDecodePlan.make(
          sourceWidth: width,
          sourceHeight: height
        )
      else {
        return nil
      }

      let thumbnailOptions: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceCreateThumbnailWithTransform: explicitOrientation == nil,
        kCGImageSourceThumbnailMaxPixelSize: decodePlan.thumbnailMaxPixelSize,
        kCGImageSourceShouldCacheImmediately: true,
      ]

      guard
        let thumbnail = CGImageSourceCreateThumbnailAtIndex(
          source,
          0,
          thumbnailOptions as CFDictionary
        )
      else {
        return nil
      }

      guard
        StaticImageLimits.acceptsDecoded(
          width: thumbnail.width,
          height: thumbnail.height
        )
      else {
        return nil
      }

      let actualScale = CGFloat(
        decodePlan.sourceScaleFactor(
          decodedWidth: thumbnail.width,
          decodedHeight: thumbnail.height
        )
      )

      return DecodedStaticImage(
        image: UIImage(
          cgImage: thumbnail,
          scale: 1,
          orientation: explicitOrientation ?? .up
        ),
        sourceScaleFactor: actualScale
      )
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
