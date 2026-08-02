import Foundation

#if canImport(MLKitVision)
  import MLKitVision

  struct ProcessedImage {
    let image: VisionImage
    let metadata: ImageMetadata
  }

  struct ImageMetadata {
    let width: Int
    let height: Int
    let orientation: UIImage.Orientation
    let isInverted: Bool
    /// Origin of the ROI crop, in the same pixel space as `width`/`height` (post-orientation,
    /// pre-scale). Downstream code adds this back onto ML Kit result coordinates to remap them
    /// to full-source-image coordinates. Zero when no ROI crop was applied.
    let offsetX: CGFloat
    let offsetY: CGFloat
    /// Scale factor applied during preprocessing, needed to unscale result coordinates when
    /// remapping them back to full-source-image coordinates.
    let scaleFactor: CGFloat

    init(
      width: Int,
      height: Int,
      orientation: UIImage.Orientation,
      isInverted: Bool,
      offsetX: CGFloat = 0,
      offsetY: CGFloat = 0,
      scaleFactor: CGFloat = 1.0
    ) {
      self.width = width
      self.height = height
      self.orientation = orientation
      self.isInverted = isInverted
      self.offsetX = offsetX
      self.offsetY = offsetY
      self.scaleFactor = scaleFactor
    }
  }
#endif
